package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("ShipmentDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/ShipmentDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ShipmentDao extends OntimizeJdbcDaoSupport {

    public static final String ATTR_ID                  = "shipment_id";
    public static final String ATTR_ORDER_ID            = "order_id";
    public static final String ATTR_SHIPMENT_DATE       = "shipment_date";
    public static final String ATTR_SHIPMENT_COMPANY    = "shipment_company";
    public static final String ATTR_PRICE               = "price";
    public static final String ATTR_TRACKING_NUMBER     = "tracking_number";
    public static final String ATTR_SENDER_ADDRESS      = "sender_address";
    public static final String ATTR_BUYER_PHONE         = "buyer_phone";
    public static final String ATTR_SHIPPING_ADDRESS    = "shipping_address";

}
