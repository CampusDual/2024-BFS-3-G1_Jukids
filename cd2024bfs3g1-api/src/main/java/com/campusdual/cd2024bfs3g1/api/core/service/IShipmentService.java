package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.List;
import java.util.Map;

public interface IShipmentService {

    EntityResult shipmentQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult pendingReceiveQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult pendingConfirmQuery(Map<String, Object> shipmentData, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult shipmentSentUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException;

    EntityResult shipmentReceivedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException;

    EntityResult shipmentConfirmedUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap) throws OntimizeJEERuntimeException;
}
