package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IShipmentService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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
    private UserDao userDao;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    private static final String UPDATEERROR = "Error al actualizar el estado del juguete";
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    private static final int TRACK_MAX_LENGTH = 10;
    private static final Random RANDOM = new SecureRandom();

    @Override
    public EntityResult shipmentQuery(Map<String, Object> shipmentData, List<String> attrList) {
        return this.daoHelper.query(this.shipmentDao, shipmentData, attrList);
    }

    //Muestra juguetes del estado 1 al comprador
    @Override
    public EntityResult pendingSendQuery(Map<String, Object> keyMap, List<String> attrList) {
        keyMap.put(OrderDao.ATTR_SESSION_ID, new SearchValue(SearchValue.NOT_NULL, null));
        return Utils.queryByStatusBuyer(daoHelper, shipmentDao, userDao, keyMap, attrList, ToyDao.STATUS_PENDING_SHIPMENT, ShipmentDao.QUERY_SHIP_ORDER_TOY);
    }

    //Muestra juguetes del estado 2 al comprador
    @Override
    public EntityResult pendingReceiveQuery(Map<String, Object> shipmentData, List<String> attrList) {
        return Utils.queryByStatusBuyer(daoHelper, shipmentDao, userDao, shipmentData, attrList, ToyDao.STATUS_SENT, ShipmentDao.QUERY_SHIP_ORDER_TOY);
    }

    //Muestra juguetes del estado 3 al comprador
    @Override
    public EntityResult pendingConfirmQuery(Map<String, Object> shipmentData, List<String> attrList) {
        return Utils.queryByStatusBuyer(daoHelper, shipmentDao, userDao, shipmentData, attrList, ToyDao.STATUS_RECEIVED, ShipmentDao.QUERY_SHIP_ORDER_TOY);
    }

    //Actualizar estado del 1 al 2
    @Override
    @Transactional
    public EntityResult shipmentSentUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

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

        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, ShipmentDao.QUERY_SHIP_ORDER_TOY);

        if (shipmentData.isWrong() || shipmentData.isEmpty()) {
            return Utils.createError("Error al recuperar el envío");
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

        if (shipmentUpdateResult.isWrong()) {
            return Utils.createError("Error al actualizar el envío");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 2

        Map<String, Object> toyUpdateValues = new HashMap<>();
        toyUpdateValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_SENT);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, toyUpdateValues, toyKeyMap);

        if (toyUpdateResult.isWrong()) {
            return Utils.createError(UPDATEERROR);
        }

        return Utils.createMessageResult("Envío realizado con éxito");
    }

    public static String generateRandomTrack() {
        StringBuilder trackingNumber = new StringBuilder(TRACK_MAX_LENGTH);
        for (int i = 0; i < TRACK_MAX_LENGTH; i++) {
            trackingNumber.append(CHARACTERS.charAt(RANDOM.nextInt(CHARACTERS.length())));
        }
        return trackingNumber.toString();
    }

    //Actualizar estado del 2 al 3
    @Override
    @Transactional
    public EntityResult shipmentReceivedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        //Especificamos los parámetros de busqueda

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_TOY_ID, keyMap.get(ToyDao.ATTR_ID));
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_SENT);

        //Verificamos el TOYS - TRANSACTION_STATUS y ORDER - BUYER_ID

        List<String> resultAttributes = Arrays.asList(OrderDao.ATTR_TOY_ID, ToyDao.ATTR_TRANSACTION_STATUS, OrderDao.ATTR_BUYER_ID);
        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, ShipmentDao.QUERY_SHIP_ORDER_TOY);

        if (shipmentData.isEmpty() || shipmentData.isWrong()) {
            return Utils.createError("El envío no existe o no tienes los permisos necesarios");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 3

        Integer toyId = (Integer) shipmentData.getRecordValues(0).get(ToyDao.ATTR_ID);
        Map<String, Object> updateToy = new HashMap<>();
        updateToy.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RECEIVED);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateToy, toyKeyMap);

        if (toyUpdateResult.isWrong()) {
            return Utils.createError(UPDATEERROR);
        }

        return Utils.createMessageResult("Recepción del envío confirmada!");
    }

    //Actualizar estado del 3 al 4
    @Override
    @Transactional
    public EntityResult shipmentConfirmedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        //Especificamos los parámetros de busqueda

        Map<String, Object> searchValues = new HashMap<>();
        searchValues.put(OrderDao.ATTR_TOY_ID, keyMap.get(ToyDao.ATTR_ID));
        searchValues.put(OrderDao.ATTR_BUYER_ID, idUser);
        searchValues.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RECEIVED);

        //Verificamos el TOYS - TRANSACTION_STATUS y ORDER - BUYER_ID

        List<String> resultAttributes = Arrays.asList(OrderDao.ATTR_TOY_ID, ToyDao.ATTR_TRANSACTION_STATUS, OrderDao.ATTR_BUYER_ID);
        EntityResult shipmentData = this.daoHelper.query(this.shipmentDao, searchValues, resultAttributes, ShipmentDao.QUERY_SHIP_ORDER_TOY);

        if (shipmentData.isEmpty() || shipmentData.isWrong()) {
            return Utils.createError("El envío no existe o no tienes los permisos necesarios");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS a 4

        Integer toyId = (Integer) shipmentData.getRecordValues(0).get(ToyDao.ATTR_ID);
        Map<String, Object> updateToy = new HashMap<>();
        updateToy.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);

        Map<String, Object> toyKeyMap = new HashMap<>();
        toyKeyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateToy, toyKeyMap);

        if (toyUpdateResult.isWrong()) {
            return Utils.createError(UPDATEERROR);
        }

        return Utils.createMessageResult("Estado del juguete verificado. Disfruta de tu compra!");
    }
}