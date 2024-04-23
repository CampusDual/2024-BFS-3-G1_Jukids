package com.campusdual.cd2024bfs3g1.model.core.dao;

import com.ontimize.jee.server.dao.common.ConfigurationFile;
import com.ontimize.jee.server.dao.jdbc.OntimizeJdbcDaoSupport;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Date;

@Lazy
@Repository(value = "ToyDao")
@ConfigurationFile(
        configurationFile = "dao/ToyDao.xml",
        configurationFilePlaceholder = "dao/placeholders.properties")
public class ToyDao extends OntimizeJdbcDaoSupport{
    private int toyid;
    private String name;
    private String description;
    private Date dateadded;
    private BigDecimal price;
    private Byte photo;
    private Double longitude;
    private Double latitude;

    public ToyDao(){

    }

}
