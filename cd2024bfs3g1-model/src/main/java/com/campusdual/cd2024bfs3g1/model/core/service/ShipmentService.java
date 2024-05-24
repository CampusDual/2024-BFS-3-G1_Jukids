package com.campusdual.cd2024bfs3g1.model.core.service;


import com.campusdual.cd2024bfs3g1.api.core.service.IShipmentService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
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
    @Transactional
    public EntityResult shipmentSentUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

        Integer orderId = (Integer) attrMap.get(ShipmentDao.ATTR_ORDER_ID);

        //Generamos SHIPMENTS - TRACKING NUMBER
        //y SHIPMENTS - SHIPMENT_DATE

        String trackingNumber = generateRandomTrack();
        attrMap.put(ShipmentDao.ATTR_TRACKING_NUMBER, trackingNumber);
        attrMap.put(ShipmentDao.ATTR_SHIPMENT_DATE, LocalDateTime.now());

//        HashMap<String, Object> toyKeysValues = new HashMap<>();
//        toyKeysValues.put(OrderDao.ATTR_ID, toyId);
//        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_PRICE);
//        EntityResult toyData = this.daoHelper.query(toyDao, toyKeysValues, toyAttributes);
//
//        if(toyData.isWrong() || toyData.isEmpty()){
//
//            createError("Error al recuperar el id del juguete!");
//        }

        return this.daoHelper.update(this.shipmentDao, attrMap, keyMap);
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }
}
