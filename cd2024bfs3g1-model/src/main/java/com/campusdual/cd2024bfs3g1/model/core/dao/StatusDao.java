package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("StatusDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/StatusDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class StatusDao extends OntimizeJdbcDaoSupport {
    public static final String ATTR_ID = "statusid";
    public static final String ATTR_NAME = "name";
    public static final String ATTR_CODE = "code";
}