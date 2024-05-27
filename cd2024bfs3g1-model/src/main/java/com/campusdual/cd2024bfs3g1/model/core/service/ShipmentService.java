package com.campusdual.cd2024bfs3g1.model.core.service;


import com.campusdual.cd2024bfs3g1.api.core.service.IShipmentService;
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

@Service("ShipmentService")
@Lazy
public class ShipmentService implements IShipmentService {

    @Autowired
    private ShipmentDao shipmentDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ToyDao toyDao;
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
    public EntityResult shipmentQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException{

        return this.daoHelper.query(this.shipmentDao, shipmentData, attrList);
    }

    @Override
    public EntityResult shipmentReceivedQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException {

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

        // Creamos el mapa de búsqueda

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS,toyDao.STATUS_RECEIVED);

        return this.daoHelper.query(this.shipmentDao, searchValues, attrList, "shipmentReceived");
    }

    @Override
    @Transactional
    public EntityResult shipmentSentUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

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

        //Recuperamos TOYS - USER_ID y TRANSACTION_STATUS

        Integer toyId = (Integer) attrMap.get(ShipmentDao.ATTR_ORDER_ID);
        HashMap<String, Object> toyKeyValues = new HashMap<>();
        toyKeyValues.put(ToyDao.ATTR_USR_ID, toyId);
        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_USR_ID,ToyDao.ATTR_TRANSACTION_STATUS);
        EntityResult toyData = this.daoHelper.query(toyDao,toyKeyValues, toyAttributes);

        if (toyData.isWrong() || toyData.isEmpty()) {
            return createError("Error al recuperar el juguete");
        }

        Integer toyOwnerId= (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_USR_ID);
        Integer transactionStatus = (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_TRANSACTION_STATUS);

        if(!idUser.equals(toyOwnerId)){
            return createError("No tienes permisos para realizar este envío");
        }

        if(transactionStatus != 1){
            return createError("El juguete no esta pendiente de envío");
        }

        //Generamos SHIPMENTS - TRACKING NUMBER y SHIPMENT_DATE

        String trackingNumber = generateRandomTrack();
        attrMap.put(ShipmentDao.ATTR_TRACKING_NUMBER, trackingNumber);
        attrMap.put(ShipmentDao.ATTR_SHIPMENT_DATE, LocalDateTime.now());

        //Hacemos Update a SHIPMENTS

        EntityResult shipmentResult = this.daoHelper.update(this.shipmentDao, attrMap, keyMap);

        //Actualizamos TOYS - TRANSACTION_STATUS

        Map<String,Object> updateToy = new HashMap<>();
        updateToy.put(ToyDao.ATTR_TRANSACTION_STATUS, 2);

        Map<String,Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateToy, toyKeyMap);

        if (toyUpdateResult.isWrong()){

            return createError("Error al actualizar el estado del juguete");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Envio realizado");

        return result;
    }

    @Override
    @Transactional
    public EntityResult shipmentReceivedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

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

        return null;
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }
}
