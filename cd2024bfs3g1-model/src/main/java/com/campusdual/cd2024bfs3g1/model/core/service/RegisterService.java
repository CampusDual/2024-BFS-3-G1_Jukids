package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IRegisterService;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserRoleDao;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Lazy
@Service("RegisterService")
public class RegisterService implements IRegisterService {
    public static final int ROL_USER = 2;
    @Autowired
    private UserDao userDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private UserAndRoleService userAndRole;

    @Autowired
    private UserRoleDao userRoleDao;

    @Override
    public EntityResult registerInsert(Map<?, ?> attrMap) throws OntimizeJEERuntimeException {

        // Validación correo electronico
        if(!Utils.validaEmail((String) attrMap.get("usr_login"))){
            EntityResult error = new EntityResultMapImpl();
            error.setCode(EntityResult.OPERATION_WRONG);
            error.setMessage("El correo electrónico no es correcto");
            return error;
        }
        // Validación si cuenta de correo existe
        if (existsEmail((String) attrMap.get("usr_login"))) {
            EntityResult existe = new EntityResultMapImpl();
            existe.setCode(EntityResult.OPERATION_WRONG);
            existe.setMessage("Ya existe una cuenta con este correo");
            return existe;
        }

        //Insertamos registro con contraseña encriptada
        EntityResult insercion = this.daoHelper.insert(this.userDao,userAndRole.encryptPassword(attrMap));


        if(insercion.isWrong()) {
            return insercion;
        }

        // Asignamos rol de usuario al nuevo registro
        Object userId = insercion.get("usr_id");
        HashMap<String,Object> attrMapRole = new HashMap<>();
        attrMapRole.put("usr_id",userId);
        attrMapRole.put("rol_id", ROL_USER);

        return this.daoHelper.insert(this.userRoleDao,attrMapRole);

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
