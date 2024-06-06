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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service("OrderService")
@Lazy
public class OrderService implements IOrderService{

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

    @Override
    public EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

            Integer idUser = (Integer) idGetter();
            keyMap.put(OrderDao.ATTR_BUYER_ID, idUser);
            return this.daoHelper.query(this.orderDao, keyMap, attrList);

    }

    //Muestra juguetes del estado 4
    @Override
    public EntityResult PurchasedQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException {

        Integer idUser = (Integer) idGetter();
        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);

        return this.daoHelper.query(this.orderDao, searchValues, attrList, "orderJoin");
    }

    @Override
    @Transactional
    public EntityResult orderInsert(Map<String, Object> orderData)throws OntimizeJEERuntimeException{

        //Recuperamos ORDER - BUYER_ID, BUYER_EMAIL
        //Generamos ORDER - ORDER_DATE

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Integer idUser = (Integer) idGetter();

        //Poblamos orderData, el HashMap que usaremos para el insert en ORDERS

        orderData.put(OrderDao.ATTR_BUYER_ID, idUser);
        orderData.put(OrderDao.ATTR_BUYER_EMAIL, email);
        orderData.put(OrderDao.ATTR_ORDER_DATE, LocalDateTime.now());

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        Integer toyId = (Integer) orderData.get(OrderDao.ATTR_TOY_ID);

        HashMap<String, Object> toyKeyValues = new HashMap<>();
        toyKeyValues.put(ToyDao.ATTR_ID, toyId);
        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_PRICE, ToyDao.ATTR_TRANSACTION_STATUS);
        EntityResult toyData = this.daoHelper.query(toyDao, toyKeyValues, toyAttributes);

        if(toyData.isWrong() || toyData.isEmpty()){

            createError("Error al recuperar el precio del juguete!");
        }

        //Recuperamos TOYS - PRICE
        //Calculamos ORDER - TOTAL_PRICE

        //Porcentaje que deseamos de comision

        double JUKIDS_COMMISSION = 7;

        BigDecimal toyPriceDecimal = (BigDecimal) toyData.getRecordValues(0).get(ToyDao.ATTR_PRICE);
        double toyPrice = toyPriceDecimal.doubleValue();

        double totalPrice = toyPrice / (1 - JUKIDS_COMMISSION / 100);

        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

        //Verificamos disponibilidad del juguete e insertamos en ORDERS

        Integer available = (Integer)toyData.getRecordValues(0).get(ToyDao.ATTR_TRANSACTION_STATUS);

        if(available != 0){

            return createError("El producto no se encuentra disponible");
        }

        EntityResult orderResult = this.daoHelper.insert(this.orderDao, orderData);

        if (orderResult.isWrong()) {

            return createError("Error al crear la orden");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 4)

        Map<String,Object> updateStatus = new HashMap<>();
        updateStatus.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);
        Map<String,Object> keyMap = new HashMap<>();
        keyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateStatus, keyMap);

        if(toyUpdateResult.isWrong()){

            return createError("Error al actualizar el transaction_status");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Orden creada correctamente");

        return result;
    }


    @Override
    @Transactional
    public EntityResult orderAndShipmentInsert(Map<String,Object>shipmentData)throws OntimizeJEERuntimeException{

        //Extraemos el TOY - TOYID que viene guardado en el campo SHIPMENT - ORDER_ID desde front

        Integer toyId = (Integer) shipmentData.remove(ShipmentDao.ATTR_ORDER_ID);

        //Recuperamos ORDER - BUYER_ID, BUYER_EMAIL
        //Generamos ORDER - ORDER_DATE

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Integer idUser = (Integer) idGetter();

        //Creamos y poblamos orderData, el HashMap que usaremos para el insert en ORDERS

        Map<String, Object> orderData = new HashMap<>();
        orderData.put(OrderDao.ATTR_TOY_ID, toyId);
        orderData.put(OrderDao.ATTR_BUYER_ID, idUser);
        orderData.put(OrderDao.ATTR_BUYER_EMAIL, email);
        orderData.put(OrderDao.ATTR_ORDER_DATE, LocalDateTime.now());

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        HashMap<String, Object> toyKeyValues = new HashMap<>();
        toyKeyValues.put(ToyDao.ATTR_ID, toyId);
        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_PRICE, ToyDao.ATTR_TRANSACTION_STATUS);
        EntityResult toyData = this.daoHelper.query(toyDao, toyKeyValues, toyAttributes);

        if(toyData.isWrong() || toyData.isEmpty()){

            createError("Error al recuperar el precio del juguete!");
        }

        //Recuperamos TOYS - PRICE y SHIPMENTS - PRICE
        //Calculamos ORDER - TOTAL_PRICE

        //Porcentaje que deseamos de comision

        double JUKIDS_COMMISSION = 7;

        BigDecimal toyPriceDecimal = (BigDecimal) toyData.getRecordValues(0).get(ToyDao.ATTR_PRICE);
        double toyPrice = toyPriceDecimal.doubleValue();

        Integer priceInteger = (Integer) shipmentData.get(ShipmentDao.ATTR_PRICE);
        double shipmentPrice = priceInteger.doubleValue();

        double totalPrice = (toyPrice / (1 - JUKIDS_COMMISSION / 100)) + shipmentPrice;

        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

        //Verificamos disponibilidad del juguete e insertamos en ORDERS

        Integer available = (Integer)toyData.getRecordValues(0).get(ToyDao.ATTR_TRANSACTION_STATUS);

        if(available != 0){

            return createError("El producto no se encuentra disponible");
        }

        EntityResult orderResult = this.daoHelper.insert(this.orderDao, orderData);

        if (orderResult.isWrong()) {

            return createError("Error al crear la orden");
        }

        //Recuperamos ORDERS - ORDER_ID
        //Asignamos el verdadero SHIPMENTS - ORDER_ID

        Integer orderId = (Integer) orderResult.get(OrderDao.ATTR_ID);
        shipmentData.put(ShipmentDao.ATTR_ORDER_ID, orderId);

        //TODO:Quitar esto cuando sea nullable en DB

        shipmentData.put(ShipmentDao.ATTR_TRACKING_NUMBER, "0000000000");

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

    @Override
    public EntityResult ordersWithToysQuery(Map<String, Object> keyMap, List<String> attrList)throws OntimizeJEERuntimeException {

        Integer idUser = (Integer) idGetter();
        keyMap.put(OrderDao.ATTR_BUYER_ID, idUser);

        return this.daoHelper.query(this.orderDao, keyMap, attrList, OrderDao.QUERY_JOIN_ORDERS_TOYS);
    }

    public Object idGetter(){

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (email != null) {

            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, email);
            List<String> attributes = List.of(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues, attributes);

            if (userData.isEmpty() || userData.isWrong()) {

                return createError("Error al recuperar el usuario");
            }

            return userData.getRecordValues(0).get(UserDao.USR_ID);

        }else{

            return createError("No estas logueado");
        }
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);
        return errorEntityResult;
    }
}
