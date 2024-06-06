package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyOwnerService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();
        keyMap.put(UserDao.USR_ID, idUser);

        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    //Muestra juguetes del estado 0
    @Override
    public EntityResult saleToyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();
        keyMap.put(UserDao.USR_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_AVAILABLE);

        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    //Muestra juguetes del estado 1
    @Override
    public EntityResult pendingSendQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();
        keyMap.put(UserDao.USR_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PENDING_SHIPMENT);

        return this.daoHelper.query(this.toyDao, keyMap, attrList, "toyJoin");
    }

    //Muestra juguetes del estado 2
    @Override
    public EntityResult pendingConfirmQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();

        keyMap.put(UserDao.USR_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS,
                new SearchValue (SearchValue.IN, Arrays.asList(ToyDao.STATUS_SENT, ToyDao.STATUS_RECEIVED)));

        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    //Muestra juguetes del estado 4
    @Override
    public EntityResult toySoldQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();
        keyMap.put(UserDao.USR_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);

        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    @Override
    public EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {

        Integer idUser = (Integer) idGetter();
        attrMap.put(UserDao.USR_ID, idUser);

        return this.daoHelper.insert(this.toyDao, attrMap);
    }

    @Override
    public EntityResult toyUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();

        HashMap<String, Object> keyToyValues = new HashMap<>();
        keyToyValues.put(ToyDao.ATTR_USR_ID, idUser);
        List<String> toyList = List.of(ToyDao.ATTR_USR_ID);
        EntityResult toyData = this.daoHelper.query(toyDao, keyToyValues, toyList);

        Integer toyIdUser = (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_USR_ID);
        attrMap.put(UserDao.USR_ID, idUser);

        if (!idUser.equals(toyIdUser)){

            return createError("No tienes permisos para actualizar este juguete: ");
        }

        return this.daoHelper.update(this.toyDao, attrMap, keyMap);
     }

    @Override
    public EntityResult toyDelete(Map<String, Object> keyMap) throws OntimizeJEERuntimeException{

        Integer idUser = (Integer) idGetter();

        HashMap<String, Object> keyToyValues = new HashMap<>();
        keyToyValues.put(ToyDao.ATTR_USR_ID, idUser);
        List<String> toyList = List.of(ToyDao.ATTR_USR_ID);
        EntityResult toyData = this.daoHelper.query(toyDao, keyToyValues, toyList);

        Integer toyIdUser = (Integer) toyData.getRecordValues(0).get(ToyDao.ATTR_USR_ID);

        if (!idUser.equals(toyIdUser)){

            return createError("No tienes permisos para borrar este juguete: ");
        }

        return this.daoHelper.delete(this.toyDao, keyMap);
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