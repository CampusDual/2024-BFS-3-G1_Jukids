package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IChartService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ChartDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("ChartService")
@Lazy
public class ChartService implements IChartService {

    public static final String ADMIN = "admin";
    @Autowired
    private ChartDao chartDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult chartQuery(Map<String, Object> keyMap, List<String> attrList)
            throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.chartDao, keyMap, attrList);
    }

    public EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList)
            throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.orderDao, keyMap, attrList);
    }

    public EntityResult totalOrdersQuery(Map<String, Object> keyMap, List<String> attrList)
            throws OntimizeJEERuntimeException {
        String role = Utils.getRole();
        if (!ADMIN.equalsIgnoreCase(role)) {
            EntityResult error = new EntityResultMapImpl();
            error.setCode(EntityResult.OPERATION_WRONG);
            error.setMessage("No tienes permisos para acceder");
            return error;
        }
        return this.daoHelper.query(chartDao, keyMap, attrList,ChartDao.QUERY_TOTAL_ORDERS);
    }
}