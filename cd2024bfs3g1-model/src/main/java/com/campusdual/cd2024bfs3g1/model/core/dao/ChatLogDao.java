package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;
@Repository("ChatLogDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/ChatLogDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ChatLogDao extends OntimizeJdbcDaoSupport {
    public static final String ATTR_CUSTOMER_ID = "customer_id";
    public static final String ATTR_OWNER_ID = "owner_id";
    public static final String ATTR_TOY_ID = "toy_id";
    public static final String ATTR_MSG = "msg";
    public static final String ATTR_INSERTED_DATE = "inserted_date";
    public static final String ATTR_CUSTOMER_NAME = "customer_name";
    public static final String ATTR_CUSTOMER_AVATAR = "customer_avatar";
    public static final String ATTR_PRICE = "price";
    public static final String ATTR_TOY_NAME= "toy_name";
    public static final String ATTR_SELLER_NAME = "seller_name";
    public static final String ATTR_SELLER_AVATAR = "seller_avatar";
}
