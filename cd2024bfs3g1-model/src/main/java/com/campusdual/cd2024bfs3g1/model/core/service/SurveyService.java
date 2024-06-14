package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.ISurveyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.SurveyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
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

@Service("SurveyService")
@Lazy
public class SurveyService implements ISurveyService {
    @Autowired
    private SurveyDao surveyDao;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult surveyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);
        keyMap.put(SurveyDao.ATTR_SELLER_ID, idUser);

        return this.daoHelper.query(this.surveyDao, keyMap, attrList, SurveyDao.QUERY_JOIN_SURVEYS_USER);
    }

    @Override
    public EntityResult surveyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {
        this.daoHelper.insert(this.surveyDao, attrMap);

        Map<String, Object> updateStatus = new HashMap<>();
        updateStatus.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_RATED);

        Map<String, Object> keyMap = new HashMap<>();
        keyMap.put(ToyDao.ATTR_ID, attrMap.get("toy_id"));

        this.daoHelper.update(this.toyDao, updateStatus, keyMap);

        EntityResult result = new EntityResultMapImpl();

        result.setMessage("Gracias por valorar");

        return result;
    }
}