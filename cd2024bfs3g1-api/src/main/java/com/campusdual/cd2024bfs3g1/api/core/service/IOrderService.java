package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IOrderService {

    EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    //Muestra juguetes del estado 4
    EntityResult PurchasedQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult orderInsert(Map<String, Object> orderData)throws OntimizeJEERuntimeException;
    EntityResult orderAndShipmentInsert(Map<String,Object>shipmentData)throws OntimizeJEERuntimeException;
    EntityResult ordersWithToysQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;
}
