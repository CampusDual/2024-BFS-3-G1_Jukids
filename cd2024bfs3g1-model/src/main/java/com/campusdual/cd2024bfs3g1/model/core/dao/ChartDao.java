package com.campusdual.cd2024bfs3g1.model.core.dao;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;

@Repository("ChartsDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/ChartsDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ChartDao extends OntimizeJdbcDaoSupport {

        //public static final String ATTR_ID = "ID";
        //public static final String ATTR_PHOTO = "PHOTO";

}
