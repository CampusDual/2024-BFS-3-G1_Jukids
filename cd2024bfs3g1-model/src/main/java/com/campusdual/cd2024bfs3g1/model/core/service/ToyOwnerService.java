package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyOwnerService;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service("ToyOwnerService")
@Lazy
public class ToyOwnerService implements IToyOwnerService {

    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException{
        Authentication auth= SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        if(email != null){
            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, email);
            List<String> attributes = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues,attributes);
            if(userData.isWrong()){
                return userData;
            }
            if(userData.isEmpty()){
                EntityResult errEntityResult = new EntityResultMapImpl();
                errEntityResult.setCode(EntityResult.OPERATION_WRONG);
                errEntityResult.setMessage("No se encuentra el usuario: " + email);
                return errEntityResult;
            }
            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);
            keyMap.put("usr_id",idUser);
            return this.daoHelper.query(this.toyDao, keyMap, attrList);
        } else {
            EntityResult errEntityResult = new EntityResultMapImpl();
            errEntityResult.setCode(EntityResult.OPERATION_WRONG);
            errEntityResult.setMessage("No estas logeado");
            return errEntityResult;
        }

    }

    @Override
    public EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userLogin = auth.getName();
        if (userLogin != null) {
            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, userLogin);
            List<String> attrList = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues, attrList);
            if (userData.isWrong()) {
                return userData;
            }
            if (userData.isEmpty()) {
                EntityResult errEntityResult = new EntityResultMapImpl();
                errEntityResult.setCode(EntityResult.OPERATION_WRONG);
                errEntityResult.setMessage("No se encuentra el usuario: " + userLogin);
                return errEntityResult;
            }
            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);
            attrMap.put("usr_id", idUser);
            return this.daoHelper.insert(this.toyDao, attrMap);
        } else {
            EntityResult errEntityResult = new EntityResultMapImpl();
            errEntityResult.setCode(EntityResult.OPERATION_WRONG);
            errEntityResult.setMessage("No estas logeado");
            return errEntityResult;
        }
    }

    @Override
    public EntityResult toyUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException {
        return this.daoHelper.update(this.toyDao, attrMap, keyMap);
    }

    @Override
    public EntityResult toyDelete(Map<String, Object> keyMap) throws OntimizeJEERuntimeException {
        return this.daoHelper.delete(this.toyDao, keyMap);
    }
}


