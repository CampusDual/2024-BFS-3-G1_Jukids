package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.ISurveyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.SurveyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

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
    public EntityResult userAverageRatingQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(surveyDao, keyMap, attrList, SurveyDao.QUERY_USER_AVG_RATING);
    }

    @Override
    public EntityResult surveyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {

        this.daoHelper.insert(this.surveyDao, attrMap);

        Integer toyId = (Integer) attrMap.get(ToyDao.ATTR_ID);
        EntityResult toyUpdateResult = Utils.updateToyStatus(daoHelper, toyDao, toyId, ToyDao.STATUS_RATED);
        if (toyUpdateResult.isWrong()) {
            return Utils.createError("Error al actualizar el transaction_status");
        }

        return Utils.createMessageResult("Gracias por valorar");
    }
}