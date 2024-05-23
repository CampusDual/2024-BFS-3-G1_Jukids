package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IOrderService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;

@Service("OrderService")
@Lazy
public class OrderService implements IOrderService {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShipmentDao shipmentDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    private static final String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    private static final int TRACK_MAX_LENGTH = 10;
    private static final Random RANDOM = new SecureRandom();

    private String generateRandomTrack(){

        StringBuilder trackingNumber = new StringBuilder(TRACK_MAX_LENGTH);

        for(int i = 0; i < TRACK_MAX_LENGTH; i++){

            trackingNumber.append(characters.charAt(RANDOM.nextInt(characters.length())));
        }

        return trackingNumber.toString();
    }

    @Override
    public EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (email != null) {

            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, email);
            List<String> attributes = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues, attributes);

            if (userData.isEmpty() || userData.isWrong()) {

                return createError("Error al recuperar el usuario");
            }

            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);
            keyMap.put("buyer_id", idUser);

            return this.daoHelper.query(this.orderDao, keyMap, attrList);

        }else{

            return createError("No estas logueado");
        }
    }

    @Override
    public EntityResult orderInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {

        return this.daoHelper.insert(this.orderDao, attrMap);
    }

    @Override
    @Transactional
    public EntityResult createOrderAndShipment(Integer toyId, Map<String,Object>shipmentData)throws OntimizeJEERuntimeException {

        //Recuperamos ORDER - BUYER_ID, BUYER_EMAIL
        //Generamos ORDER - ORDER_DATE

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        HashMap<String, Object> keysValues = new HashMap<>();
        keysValues.put(UserDao.LOGIN, email);
        List<String> attributes = Arrays.asList(UserDao.USR_ID);
        EntityResult userData = this.daoHelper.query(userDao, keysValues, attributes);

        if (userData.isEmpty() || userData.isWrong()) {

            return createError("Error al recuperar el usuario");
        }

        Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);

        Map<String, Object> orderData = new HashMap<>();
        orderData.put("buyer_id", idUser);
        orderData.put("buyer_email", email);
        orderData.put("order_date", LocalDateTime.now());

        //Recuperamos TOY - PRICE

        HashMap<String, Object> toyKeysValues = new HashMap<>();
        toyKeysValues.put(ToyDao.ATTR_ID, toyId);
        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_PRICE);
        EntityResult toyData = this.daoHelper.query(toyDao, toyKeysValues, toyAttributes);

        if(toyData.isWrong() || toyData.isEmpty()){

            createError("Error al recuperar el precio del juguete!");
        }

        //Recuperamos SHIPMENTS - PRICE
        //Calculamos ORDER - TOTAL_PRICE

        Double JUKIDS_COMMISSION = 1.065;
        Double STRIPE_COMMISSION = 1.015;

        Double toyPrice = (Double) toyData.getRecordValues(0).get(ToyDao.ATTR_PRICE);
        Double shipmentPrice = (Double) shipmentData.get(ShipmentDao.ATTR_PRICE);
        Double totalPrice = toyPrice * JUKIDS_COMMISSION * STRIPE_COMMISSION + shipmentPrice + 0.25;

        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

        //Insertamos en ORDERS

        EntityResult orderResult = this.daoHelper.insert(this.orderDao, orderData);

        if (orderResult.isWrong()) {

            return createError("Error al insertar en orders");
        }

        //Generamos SHIPMENTS - TRACKING NUMBER
        //Recuperamos ORDERS - ORDER_ID
        //Asignamos SHIPMENTS - SHIPMENT_ID = ORDERS - ORDER_ID

        String trackingNumber = generateRandomTrack();

        Integer orderId = (Integer) orderResult.get(OrderDao.ATTR_ID);
        shipmentData.put(ShipmentDao.ATTR_ORDER_ID, orderId);
        shipmentData.put(ShipmentDao.ATTR_TRACKING_NUMBER, trackingNumber);

        //Insertamos en SHIPMENTS

        EntityResult shipmentResult = this.daoHelper.insert(this.shipmentDao, shipmentData);

        if (shipmentResult.isWrong()) {

            return createError("Error al insertar en shipments");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 1)

        Map<String,Object> updateStatus = new HashMap<>();
        updateStatus.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PENDING_SHIPMENT);
        Map<String,Object> keyMap = new HashMap<>();
        keyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateStatus, keyMap);

        if(toyUpdateResult.isWrong()){

            return createError("Error al actualizar el transaction_status");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Orden y shipment creados correctamente");

        return result;
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }
}
