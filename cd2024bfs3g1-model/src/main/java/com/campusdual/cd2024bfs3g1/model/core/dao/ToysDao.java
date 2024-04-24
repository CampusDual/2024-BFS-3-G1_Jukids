package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("ToysDao")
@Lazy
@ConfigurationFile(configurationFile = "dao/ToysDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ToysDao extends OntimizeJdbcDaoSupport {

    public static final String TOYID = "toyid";
    public static final String NAME = "name";
    public static final String DESCRIPTION = "description";
    public static final String DATEADDED = "dateadded";
    public static final String PRICE = "price";
    public static final String PHOTO = "photo";
    public static final String LONGITUDE = "longitude";
    public static final String LATITUDE = "latitude";

}
