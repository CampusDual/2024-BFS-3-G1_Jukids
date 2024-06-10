package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;


@Repository("OrderDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/OrderDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class OrderDao extends OntimizeJdbcDaoSupport {

    public static final String ATTR_ID          = "order_id";
    public static final String ATTR_TOY_ID      = "toyid";
    public static final String ATTR_BUYER_ID    = "buyer_id";
    public static final String ATTR_BUYER_EMAIL = "buyer_email";
    public static final String ATTR_ORDER_DATE  = "order_date";
    public static final String ATTR_TOTAL_PRICE = "total_price";
    public static final String ATTR_SESSION_ID = "session_id";
    public static final String QUERY_JOIN_ORDERS_TOYS = "getOrdersWithToys";
}




