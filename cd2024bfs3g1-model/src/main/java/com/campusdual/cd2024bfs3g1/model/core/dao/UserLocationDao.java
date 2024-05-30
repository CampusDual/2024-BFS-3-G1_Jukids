package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("UserLocationDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/UserLocationDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class UserLocationDao extends OntimizeJdbcDaoSupport {

    public static final String ATTR_ID = "id";
    public static final String ATTR_LONGITUDE = "longitude";
    public static final String ATTR_LATITUDE = "latitude";
    public static final String ATTR_INSERTED_DATE = "inserted_date";

}
