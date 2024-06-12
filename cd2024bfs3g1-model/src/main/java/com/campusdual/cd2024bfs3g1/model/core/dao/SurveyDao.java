package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("SurveyDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/SurveyDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class SurveyDao extends OntimizeJdbcDaoSupport {
    public static final String ATTR_SURVEY_ID = "survey_id";
    public static final String ATTR_TOY_ID = "toy_id";
    public static final String ATTR_SELLER_ID = "seller_id";
    public static final String ATTR_BUYER_ID= "buyer_id";
    public static final String ATTR_RATING= "rating";
    public static final String ATTR_COMMENT= "comment";
    public static final String QUERY_USER_AVG_RATING= "userAverageRating";
    public static final String QUERY_JOIN_SURVEYS_USER = "getNameBuyerId";
}