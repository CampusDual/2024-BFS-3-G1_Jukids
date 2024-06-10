package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IChatLogService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ChatLogDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("ChatLogService")
public class ChatLogService implements IChatLogService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private ChatLogDao chatLogDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult chatLogQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.chatLogDao, keyMap, attrList);
    }


    @Override
    public EntityResult chatLogInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {
        return this.daoHelper.insert(this.chatLogDao, attrMap);
    }

    @Override
    public EntityResult getChatLastConversationQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.chatLogDao, keyMap, attrList, "getChatLastConversation");
    }


    @Override
    public EntityResult getLoggedChatListQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        if (email != null) {

            HashMap<String, Object> keysValues = new HashMap<>();
            keysValues.put(UserDao.LOGIN, email);
            List<String> attributes = Arrays.asList(UserDao.USR_ID);
            EntityResult userData = this.daoHelper.query(userDao, keysValues, attributes);

            if (userData.isEmpty() || userData.isWrong()) {
                EntityResultMapImpl errorEntityResult = new EntityResultMapImpl();
                errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
                errorEntityResult.setMessage("Error al recuperar el usuario");

                return errorEntityResult;

            }

            Integer idUser = (Integer) userData.getRecordValues(0).get(UserDao.USR_ID);


            SQLStatementBuilder.BasicField customerIdField =
                    new SQLStatementBuilder.BasicField( ChatLogDao.ATTR_CUSTOMER_ID );

            SQLStatementBuilder.BasicField ownerIdField =
                    new SQLStatementBuilder.BasicField( UserDao.USR_ID);

            SQLStatementBuilder.BasicExpression customerIdBEField =
                    new SQLStatementBuilder.BasicExpression( customerIdField, SQLStatementBuilder.BasicOperator.EQUAL_OP, idUser );

            SQLStatementBuilder.BasicExpression ownerIdBEField =
                    new SQLStatementBuilder.BasicExpression( ownerIdField, SQLStatementBuilder.BasicOperator.EQUAL_OP, idUser );




            SQLStatementBuilder.BasicExpression totalExpression =
                    new SQLStatementBuilder.BasicExpression(customerIdBEField, SQLStatementBuilder.BasicOperator.OR_OP, ownerIdBEField);

            keyMap.put("EXPRESSION_KEY_UNIQUE_IDENTIFIER", totalExpression);



        }

        return this.daoHelper.query(this.chatLogDao, keyMap, attrList, "getLoggedChatList");
    }


}
