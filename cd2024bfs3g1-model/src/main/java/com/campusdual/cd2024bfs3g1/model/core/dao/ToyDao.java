package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("ToyDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/ToyDao.xml.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ToyDao extends OntimizeJdbcDaoSupport {
    public static final String ATTR_ID = "ID";
    public static final String ATTR_NAME = "NAME";
    public static final String ATTR_DESCRIPTION = "DESCRIPTION";
    public static final String ATTR_DATE_ADDED= "DATE_ADDED";
    public static final String ATTR_PRICE= "PRICE";
    public static final String ATTR_PHOTO = "PHOTO";
    public static final String ATTR_LATITUDE = "LATITUDE";
    public static final String ATTR_LONGITUDE = "LONGITUDE";
}
