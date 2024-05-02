package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IRegisterService;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.ols.l.LSystem;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Lazy
@Service("RegisterService")
public class RegisterService implements IRegisterService {
    @Autowired
    private UserDao userDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private UserAndRoleService userAndRole;

    @Override
    public EntityResult registerInsert(Map<?, ?> attrMap) throws OntimizeJEERuntimeException {
        if(!Utils.validaEmail((String) attrMap.get("usr_login"))){
            //System.out.println("Email invalido");
            EntityResult error = new EntityResultMapImpl();
            error.setCode(EntityResult.OPERATION_WRONG);
            error.setMessage("El correo electrónico no es correcto");
            return error;
        }

        if (existsEmail((String) attrMap.get("usr_login"))) {
            //System.out.println("Ya existe");
            EntityResult existe = new EntityResultMapImpl();
            existe.setCode(EntityResult.OPERATION_WRONG);
            existe.setMessage("Ya existe una cuenta con este correo");
            return existe;
        }


        //Insertamos registro con contraseña encriptada
        return this.daoHelper.insert(this.userDao,userAndRole.encryptPassword(attrMap));
    }

    public boolean existsEmail (String email) {
        String sqlStatement = "SELECT COUNT(*) FROM usr_user WHERE usr_login = ? ";

        try {
            int count = jdbcTemplate.queryForObject(sqlStatement, Integer.class, email);
            return count > 0;
        } catch (Exception e) {
            System.out.println("No se pudo ejecutar la sentencia: " + e.getMessage());
        }

        return false;
    }


}
