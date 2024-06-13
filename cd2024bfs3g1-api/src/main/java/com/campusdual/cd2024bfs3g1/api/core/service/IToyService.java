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

    //Querys con las diferentes categorias
    EntityResult toyChildrensToysQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyBoardQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyPlushiesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyDollsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyActionToysQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyVideogamesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyCraftsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyPedagogicalQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toySportQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyElectronicQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyFiguresQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyCollectiblesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyAntiquesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyCardsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException;

    AdvancedEntityResult toyPaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy);

    AdvancedEntityResult toyAvailablePaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy);

    EntityResult orderInsert(Map<String, Object> orderData)throws OntimizeJEERuntimeException;

    EntityResult sumPriceToysSoldQuery(Map<String, Object> keyMap, List<String> attrList);

    EntityResult getToysSellerDataQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException;

    EntityResult userAverageRatingQuery(Map<String, Object> keyMap, List<String> attrList);
}