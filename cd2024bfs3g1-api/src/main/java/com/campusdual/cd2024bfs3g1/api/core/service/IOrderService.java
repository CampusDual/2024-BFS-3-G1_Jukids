package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IOrderService {

    EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult orderInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException;

    EntityResult createOrderAndShipment(Integer toyId, Map<String,Object>shipmentData)throws OntimizeJEERuntimeException;
}
