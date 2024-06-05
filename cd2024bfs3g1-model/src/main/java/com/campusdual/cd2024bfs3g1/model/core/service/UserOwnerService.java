package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IUserOwnerService;
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

@Service("UserOwnerService")
@Lazy
public class UserOwnerService implements IUserOwnerService {

    @Autowired
    private UserDao userDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Override
    public EntityResult userQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (email != null) {
            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, email);
            List<String> attributes = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues, attributes);

            if (userData.isWrong()) {
                return userData;
            }

            if (userData.isEmpty()) {

                return createError("No se encuentra el usuario: " + email);
            }

            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);
            keyMap.put(UserDao.USR_ID, idUser);

            return this.daoHelper.query(this.userDao, keyMap, attrList);

        }else{

            return createError("No estas logueado");
        }
    }


    @Override
    public EntityResult userUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userLogin = auth.getName();

        if (userLogin != null) {
            HashMap<String, Object> keyUserValues = new HashMap<>();
            keyUserValues.put(UserDao.LOGIN, userLogin);
            List<String> attrList = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keyUserValues, attrList);

            if (userData.isWrong()) {
                return userData;
            }

            if (userData.isEmpty()) {
                return createError("No se encuentra el usuario: " + userLogin);
            }

            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);
            keyMap.put(UserDao.USR_ID, idUser);

            return this.daoHelper.update(this.userDao, attrMap, keyMap);
        } else {
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
