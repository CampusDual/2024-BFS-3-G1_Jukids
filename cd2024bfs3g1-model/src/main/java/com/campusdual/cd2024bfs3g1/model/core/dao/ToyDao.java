package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

@Repository("ToyDao.xml")
@Lazy
@ConfigurationFile(configurationFile = "dao/ToyDao.xml", configurationFilePlaceholder = "dao/placeholders.properties")
public class ToyDao extends OntimizeJdbcDaoSupport {
    public static final String ATTR_ID = "toyid";
    public static final String ATTR_NAME = "name";
    public static final String ATTR_DESCRIPTION = "description";
    public static final String ATTR_EMAIL= "email";
    public static final String ATTR_PRICE= "price";
    public static final String ATTR_PHOTO = "photo";
    public static final String ATTR_LATITUDE = "latitude";
    public static final String ATTR_LONGITUDE = "longitude";
    public static final String ATTR_USR_ID = "usr_id";
    public static final String ATTR_SHIPPING = "shipping";
    public static final String ATTR_TRANSACTION_STATUS = "transaction_status";
    public static final String ATTR_CATEGORY ="category";

    //Estados de compra: transaction_status
    public static final Integer STATUS_AVAILABLE  = 0;
    public static final Integer STATUS_PENDING_SHIPMENT  = 1;
    public static final Integer STATUS_SENT = 2;
    public static final Integer STATUS_RECEIVED = 3;
    public static final Integer STATUS_PURCHASED  = 4;

    //Agregar referencias de columnas en vista v_toy_distances
    public static final String QUERY_V_TOYS_DISTANCES = "getNearbyToys";
    public static final String ATTR_DISTANCE = "distance";


}
