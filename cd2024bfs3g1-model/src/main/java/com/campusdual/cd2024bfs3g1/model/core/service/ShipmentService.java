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

    //Muestra juguetes del estado 2
    @Override
    public EntityResult pendingReceiveQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException {

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

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_SENT);

        return this.daoHelper.query(this.shipmentDao, searchValues, attrList, "shipmentJoin");
    }

    //Muestra juguetes del estado 3
    @Override
    public EntityResult pendingConfirmQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException {

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

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RECEIVED);

        return this.daoHelper.query(this.shipmentDao, searchValues, attrList, "shipmentJoin");
    }

    //Actualizar estado del 1 al 2
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

        //Recuperamos el SHIPMENT_ID y el TOY_ID

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(ToyDao.ATTR_ID, keyMap.get(ToyDao.ATTR_ID));
        searchValues.put(ToyDao.ATTR_USR_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PENDING_SHIPMENT);

        List<String> resultAttributes = Arrays.asList(

                ShipmentDao.ATTR_ID,
                ToyDao.ATTR_ID,
                ToyDao.ATTR_TRANSACTION_STATUS,
                ToyDao.ATTR_USR_ID
        );

        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, "shipmentJoin");

        if (shipmentData.isWrong() || shipmentData.isEmpty()){
            return createError("Error al recuperar el envío");
        }

        Integer shipmentId = (Integer) shipmentData.getRecordValues(0).get(ShipmentDao.ATTR_ID);
        Integer toyId = (Integer) shipmentData.getRecordValues(0).get(ToyDao.ATTR_ID);

        //Generamos SHIPMENTS - TRACKING NUMBER y SHIPMENT_DATE

        String trackingNumber = generateRandomTrack();

        Map<String, Object> shipmentUpdateValues = new HashMap<>();
        shipmentUpdateValues.put(ShipmentDao.ATTR_SENDER_ADDRESS, attrMap.get(ShipmentDao.ATTR_SENDER_ADDRESS));
        shipmentUpdateValues.put(ShipmentDao.ATTR_TRACKING_NUMBER, trackingNumber);
        shipmentUpdateValues.put(ShipmentDao.ATTR_SHIPMENT_DATE, LocalDateTime.now());

        //Hacemos Update a SHIPMENTS

        Map<String, Object> shipmentKeyMap = new HashMap<>();
        shipmentKeyMap.put(ShipmentDao.ATTR_ID, shipmentId);

        EntityResult shipmentUpdateResult = this.daoHelper.update(this.shipmentDao, shipmentUpdateValues, shipmentKeyMap);

        if (shipmentUpdateResult.isWrong()){

            return createError("Error al actualizar el envío");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 2

        Map<String, Object> toyUpdateValues = new HashMap<>();
        toyUpdateValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_SENT);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, toyUpdateValues, toyKeyMap);

        if (toyUpdateResult.isWrong()){

            return createError("Error al actualizar el estado del juguete");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Envío realizado con éxito");

        return result;
    }

    //Actualizar estado del 2 al 3
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

        if (!keyMap.containsKey(ToyDao.ATTR_ID)) {
            return createError("Falta el ID del juguete en la solicitud");
        }

        //Especificamos los parámetros de busqueda

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_TOY_ID , keyMap.get(ToyDao.ATTR_ID));
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_SENT);

        //Verificamos el TOYS - TRANSACTION_STATUS y ORDER - BUYER_ID

        List<String> resultAttributes = Arrays.asList(OrderDao.ATTR_TOY_ID, ToyDao.ATTR_TRANSACTION_STATUS, OrderDao.ATTR_BUYER_ID);
        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, "shipmentJoin");

        if (shipmentData.isEmpty() || shipmentData.isWrong()) {
            return createError("El envío no existeo no tienes los permisos necesarios");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 3

        Integer toyId = (Integer) shipmentData.getRecordValues(0).get(ToyDao.ATTR_ID);
        Map<String, Object> updateToy = new HashMap<>();
        updateToy.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RECEIVED);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateToy, toyKeyMap);

        if (toyUpdateResult.isWrong()) {
            return createError("Error al actualizar el estado del juguete");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Recepción del envío confirmada!");

        return result;
    }

    //Actualizar estado del 3 al 4
    @Override
    @Transactional
    public EntityResult shipmentConfirmedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

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

        //Especificamos los parámetros de busqueda

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_TOY_ID , keyMap.get(ToyDao.ATTR_ID));
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RECEIVED);

        //Verificamos el TOYS - TRANSACTION_STATUS y ORDER - BUYER_ID

        List<String> resultAttributes = Arrays.asList(OrderDao.ATTR_TOY_ID, ToyDao.ATTR_TRANSACTION_STATUS, OrderDao.ATTR_BUYER_ID);
        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, "shipmentJoin");

        if (shipmentData.isEmpty() || shipmentData.isWrong()) {
            return createError("El envío no existe o no tienes los permisos necesarios");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 4

        Integer toyId = (Integer) shipmentData.getRecordValues(0).get(ToyDao.ATTR_ID);
        Map<String, Object> updateToy = new HashMap<>();
        updateToy.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateToy, toyKeyMap);

        if (toyUpdateResult.isWrong()) {
            return createError("Error al actualizar el estado del juguete");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Estado del juguete verificado. Disfruta de tu compra!");

        return result;
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }
}
