package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import java.util.List;
import java.util.Map;

public interface IToyService {

    //TOY
    EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyAvailableQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException;

    AdvancedEntityResult toyPaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy);

    AdvancedEntityResult toyAvailablePaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy);

    EntityResult orderInsert(Map<String, Object> orderData)throws OntimizeJEERuntimeException;
    EntityResult sumPriceToysSoldQuery(Map<String, Object> keyMap, List<String> attrList);
    EntityResult userAverageRatingQuery(Map<String, Object> keyMap, List<String> attrList);
}