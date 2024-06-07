package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyOwnerService;
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

import java.util.*;

@Service("ToyOwnerService")
@Lazy
public class ToyOwnerService implements IToyOwnerService {

    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShipmentDao shipmentDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) {
        return Utils.queryByStatusSeller(daoHelper, toyDao, userDao, keyMap, attrList, ToyDao.STATUS_AVAILABLE, null);
    }

    //Muestra juguetes del estado 0
    @Override
    public EntityResult saleToyQuery(Map<String, Object> keyMap, List<String> attrList) {
        return Utils.queryByStatusSeller(daoHelper, toyDao, userDao, keyMap, attrList, ToyDao.STATUS_AVAILABLE, null);
    }

    //Muestra juguetes del estado 1
    public EntityResult pendingSendQuery(Map<String, Object> keyMap, List<String> attrList) {
        return Utils.queryByStatusSeller(daoHelper, toyDao, userDao, keyMap, attrList, ToyDao.STATUS_PENDING_SHIPMENT, "toyJoin");
    }

    //Muestra juguetes del estado 2
    @Override
    public EntityResult pendingConfirmQuery(Map<String, Object> keyMap, List<String> attrList) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);
        keyMap.put(UserDao.USR_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS,
                new SearchValue(SearchValue.IN, Arrays.asList(ToyDao.STATUS_SENT, ToyDao.STATUS_RECEIVED)));

        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    //Muestra juguetes del estado 4
    @Override
    public EntityResult toySoldQuery(Map<String, Object> keyMap, List<String> attrList) {
        return Utils.queryByStatusSeller(daoHelper, toyDao, userDao, keyMap, attrList, ToyDao.STATUS_PURCHASED, null);
    }

    @Override
    public EntityResult toyInsert(Map<String, Object> attrMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);
        attrMap.put(UserDao.USR_ID, idUser);
        return this.daoHelper.insert(this.toyDao, attrMap);
    }

    @Override
    public EntityResult toyUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        HashMap<String, Object> keyToyValues = new HashMap<>();
        keyToyValues.put(ToyDao.ATTR_USR_ID, idUser);
        List<String> toyList = List.of(ToyDao.ATTR_USR_ID);
        EntityResult toyData = this.daoHelper.query(toyDao, keyToyValues, toyList);

        Integer toyIdUser = (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_USR_ID);
        attrMap.put(UserDao.USR_ID, idUser);

        if (!idUser.equals(toyIdUser)) {
            return Utils.createError("No tienes permisos para actualizar este juguete: ");
        }

        return this.daoHelper.update(this.toyDao, attrMap, keyMap);
    }

    @Override
    public EntityResult toyDelete(Map<String, Object> keyMap) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        HashMap<String, Object> keyToyValues = new HashMap<>();
        keyToyValues.put(ToyDao.ATTR_USR_ID, idUser);
        List<String> toyList = List.of(ToyDao.ATTR_USR_ID);
        EntityResult toyData = this.daoHelper.query(toyDao, keyToyValues, toyList);

        Integer toyIdUser = (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_USR_ID);

        if (!idUser.equals(toyIdUser)) {
            return Utils.createError("No tienes permisos para borrar este juguete: ");
        }

        return this.daoHelper.delete(this.toyDao, keyMap);
    }
}