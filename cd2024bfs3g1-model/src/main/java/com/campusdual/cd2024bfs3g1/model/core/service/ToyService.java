package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.*;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.db.AdvancedEntityResultMapImpl;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("ToyService")
@Lazy
public class ToyService implements IToyService {

    public static final int MINUTES = 10;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserLocationDao userLocationDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private UserDao userDao;
    @Autowired
    private SurveyDao surveyDao;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    @Override
    public EntityResult toyDetailQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        attrList.add(OrderDao.ATTR_BUYER_ID);
        attrList.add(OrderDao.ATTR_SESSION_ID);
        return this.daoHelper.query(this.toyDao, keyMap, attrList, ToyDao.QUERY_TOY_ORDER_USER);
    }

    @Override
    public AdvancedEntityResult toyPaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy) {

        //Logica de posision de distancia.

        //Rearmar el XML toyPaginationQuery basado en la vista realizada.

        //Retornar el resultado

        return this.daoHelper.paginationQuery(this.toyDao, keysValues, attributes, recordNumber, startIndex, orderBy, "default");
    }

    @Override
    public EntityResult toyAvailableQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put("transaction_status", ToyDao.STATUS_AVAILABLE);

        if( keyMap.containsKey("latitude") && keyMap.containsKey("longitude") ){
            return  searchByDistance( keyMap, attrList );
        }
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    ////Querys con las diferentes categorias
    @Override
    public EntityResult toyChildrensToysQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_CHILDRENSTOYS);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyBoardQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_BOARD);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyPlushiesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_PLUSHIES);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyDollsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_DOLLS);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyActionToysQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_ACCIONTOYS);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyVideogamesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_VIDEOGAMES);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyCraftsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_CRAFTS);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyPedagogicalQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_PEDAGOGICAL);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toySportQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_SPORT);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyElectronicQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_ELECTRONIC);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyFiguresQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_FIGURES);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyCollectiblesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_COLLECTIBLES);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyAntiquesQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_ANTIQUES);
        return toyAvailableQuery(keyMap, attrList);
    }

    @Override
    public EntityResult toyCardsQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put(ToyDao.ATTR_CATEGORY, ToyDao.CAT_CARDS);
        return toyAvailableQuery(keyMap, attrList);
    }



    @Override
    public AdvancedEntityResult toyAvailablePaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy) {

        //Extraer el basicExpression
        Object basicExpression =  keysValues.get("EXPRESSION_KEY_UNIQUE_IDENTIFIER");

        //Extraer los datos del basicExpression
        Hashtable<String, Object> fields  = getHashMapExpression( basicExpression );

        SQLStatementBuilder.BasicField transitionField = new SQLStatementBuilder.BasicField( ToyDao.ATTR_TRANSACTION_STATUS );
        SQLStatementBuilder.BasicExpression transitionStatusBA = new SQLStatementBuilder.BasicExpression( transitionField, SQLStatementBuilder.BasicOperator.EQUAL_OP, ToyDao.STATUS_AVAILABLE );

        SQLStatementBuilder.BasicExpression totalExpression = new SQLStatementBuilder.BasicExpression(transitionStatusBA, SQLStatementBuilder.BasicOperator.AND_OP, basicExpression);
        keysValues.put("EXPRESSION_KEY_UNIQUE_IDENTIFIER", totalExpression);

        if( fields.containsKey( ToyDao.ATTR_LATITUDE ) && fields.containsKey(ToyDao.ATTR_LONGITUDE ) ){
            return  advanceEntitySearchByDistance( keysValues, attributes, recordNumber, startIndex, orderBy, fields );
        } else {

            //Remover columna distance y limpiar filtro orderBy distance.
            attributes.remove(attributes.get( attributes.indexOf("distance") ) );
            orderBy.clear();

        }


        return  this.daoHelper.paginationQuery(this.toyDao, keysValues, attributes, recordNumber, startIndex, orderBy, "default");
    }

    // Chat entity  -> getToysSellerData
    @Override
    public EntityResult getToysSellerDataQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.toyDao, keyMap, attrList, "getToysSellerData");
    }

    private AdvancedEntityResult advanceEntitySearchByDistance(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy, Hashtable<String, Object> fields) {

        // Borrar todas las localizaciones de mas de 10 minutos.
        HashMap<String, Object> keyMapDelete = new HashMap<>();

        // Obtener la hora actual
        LocalDateTime now = LocalDateTime.now();

        // Restar 10 minutos a la hora actual
        LocalDateTime ten_minutes_before = now.minus(Duration.ofMinutes(MINUTES));

        //Se agrega la consulta a realizar con condicional de "menor que.."
        keyMapDelete.put( UserLocationDao.ATTR_INSERTED_DATE, new SearchValue( SearchValue.LESS, ten_minutes_before ));

        EntityResult delete_result =  this.daoHelper.delete(this.userLocationDao, keyMapDelete );

        if (delete_result.isWrong() ) {
            return new AdvancedEntityResultMapImpl(
                    AdvancedEntityResult.OPERATION_WRONG,
                    AdvancedEntityResult.type
            );
        }

        // Insertar localizacion actual y recuperar el ID
        HashMap<String, Object> attrValue = new HashMap<>();

        attrValue.put( UserLocationDao.ATTR_LATITUDE, fields.get(UserLocationDao.ATTR_LATITUDE)  );
        attrValue.put( UserLocationDao.ATTR_LONGITUDE, fields.get(UserLocationDao.ATTR_LONGITUDE)  );

        EntityResult insert_result =   this.daoHelper.insert( this.userLocationDao, attrValue);

        if (insert_result.isWrong()) {
            return new AdvancedEntityResultMapImpl(
                    AdvancedEntityResult.OPERATION_WRONG,
                    AdvancedEntityResult.type
            );
        }

        //Recuperamos la localizacion
        Object location = insert_result.get( UserLocationDao.ATTR_ID );

        //Extraer el BasicExpression del keysValues
        Object basicExpressionLocation =  keysValues.get("EXPRESSION_KEY_UNIQUE_IDENTIFIER");

        // Agregar el ID del UserLocationDao para la query
        SQLStatementBuilder.BasicField transitionFieldLOCATION =
                new SQLStatementBuilder.BasicField( UserLocationDao.ATTR_ID );

        SQLStatementBuilder.BasicExpression transitionStatusBELOCATION =
                new SQLStatementBuilder.BasicExpression( transitionFieldLOCATION, SQLStatementBuilder.BasicOperator.EQUAL_OP, location );

        SQLStatementBuilder.BasicExpression totalExpressionLocation =
                new SQLStatementBuilder.BasicExpression(transitionStatusBELOCATION, SQLStatementBuilder.BasicOperator.AND_OP, basicExpressionLocation);
        keysValues.put("EXPRESSION_KEY_UNIQUE_IDENTIFIER", totalExpressionLocation);

        if( keysValues.containsKey( ToyDao.ATTR_DISTANCE ) ) {

            //Extraer el BasicExpression del keysValues
            Object basicExpressionDistance =  keysValues.get("EXPRESSION_KEY_UNIQUE_IDENTIFIER");

            // Agregar el ID del Distance para la query
            SQLStatementBuilder.BasicField transitionFieldDistance =
                    new SQLStatementBuilder.BasicField( ToyDao.ATTR_DISTANCE );
            SQLStatementBuilder.BasicExpression transitionStatusBEDistance =
                    new SQLStatementBuilder.BasicExpression( transitionFieldDistance, SQLStatementBuilder.BasicOperator.LESS_EQUAL_OP, fields.get(ToyDao.ATTR_DISTANCE) );

            SQLStatementBuilder.BasicExpression totalExpressionDistance =
                    new SQLStatementBuilder.BasicExpression(transitionStatusBEDistance, SQLStatementBuilder.BasicOperator.AND_OP, basicExpressionDistance);
            keysValues.put("EXPRESSION_KEY_UNIQUE_IDENTIFIER", totalExpressionDistance);
        }

        //purgamos latitud y longitud
        SQLStatementBuilder.BasicExpression latAndLonExpresion = (SQLStatementBuilder.BasicExpression) keysValues.get("EXPRESSION_KEY_UNIQUE_IDENTIFIER");
        Utils.pruneTree(latAndLonExpresion,ToyDao.ATTR_LATITUDE);
        Utils.pruneTree(latAndLonExpresion,ToyDao.ATTR_LONGITUDE);
        // Buscar por ID y DISTANCIA
        //return this.daoHelper.query( this.toyDao, queryMap, attrList, ToyDao.QUERY_V_TOYS_DISTANCES );

        return this.daoHelper.paginationQuery(this.toyDao, keysValues, attributes, recordNumber, startIndex, orderBy, ToyDao.QUERY_V_TOYS_DISTANCES);

    }

    private EntityResult searchByDistance(Map<String, Object> keyMap, List<String> attrList) {

        // Borrar todas las localizaciones de mas de 10 minutos.
        HashMap<String, Object> keyMapDelete = new HashMap<>();

        // Obtener la hora actual
        LocalDateTime now = LocalDateTime.now();

        // Restar 10 minutos a la hora actual
        LocalDateTime ten_minutes_before = now.minus(Duration.ofMinutes(MINUTES));

        //Se agrega la consulta a realizar con condicional de "menor que.."
        keyMapDelete.put( UserLocationDao.ATTR_INSERTED_DATE, new SearchValue( SearchValue.LESS, ten_minutes_before ));

        EntityResult delete_result = this.daoHelper.delete(this.userLocationDao, keyMapDelete );

        if (delete_result.isWrong() ) {
            return  delete_result;
        }

        // Insertar localizacion actual y recuperar el ID
        HashMap<String, Object> attrValue = new HashMap<>();

        attrValue.put( UserLocationDao.ATTR_LATITUDE, keyMap.get(UserLocationDao.ATTR_LATITUDE)  );
        attrValue.put( UserLocationDao.ATTR_LONGITUDE, keyMap.get(UserLocationDao.ATTR_LONGITUDE)  );

        EntityResult insert_result = this.daoHelper.insert( this.userLocationDao, attrValue);

        if (insert_result.isWrong()) {
            return  insert_result;
        }

        //Recuperamos la localizacion
        Object location = insert_result.get( UserLocationDao.ATTR_ID );

        HashMap<String, Object> queryMap = new HashMap<>();

        queryMap.put( UserLocationDao.ATTR_ID, location);

        if( keyMap.containsKey( ToyDao.ATTR_DISTANCE ) ) {
            queryMap.put(ToyDao.ATTR_DISTANCE, new SearchValue( SearchValue.LESS_EQUAL, keyMap.get(ToyDao.ATTR_DISTANCE) ));
        }

        // Buscar por ID y DISTANCIA
        return this.daoHelper.query( this.toyDao, queryMap, attrList, ToyDao.QUERY_V_TOYS_DISTANCES );

    }

    private Hashtable<String, Object> getHashMapExpression(Object keyExpression) {
        Hashtable<String, Object> result = new Hashtable<>();
        if(keyExpression instanceof SQLStatementBuilder.BasicExpression){
            SQLStatementBuilder.BasicExpression basicExpression = (SQLStatementBuilder.BasicExpression) keyExpression;
            if(basicExpression.getLeftOperand() instanceof SQLStatementBuilder.BasicExpression){
                result.putAll(getHashMapExpression(basicExpression.getLeftOperand()));
                result.putAll(getHashMapExpression(basicExpression.getRightOperand()));
            }else{
                String field = basicExpression.getLeftOperand().toString().toLowerCase();
                result.put(field,basicExpression.getRightOperand());
            }
        }
        return result;
    }


    @Override
    @Transactional
    public EntityResult orderInsert(Map<String, Object> orderData)throws OntimizeJEERuntimeException{

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        Integer toyId = (Integer) orderData.get(OrderDao.ATTR_TOY_ID);
        EntityResult toyData = Utils.fetchToyData(daoHelper, toyDao, toyId);
        if (toyData.isWrong() || toyData.isEmpty()) {
            return Utils.createError("Error al recuperar el precio del juguete!");
        }

        //Calculamos ORDER - TOTAL_PRICE

        double totalPrice = Utils.calculateTotalPrice(toyData);
        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);
        orderData.put(OrderDao.ATTR_ORDER_DATE, LocalDateTime.now());

        //Verificamos disponibilidad del juguete e insertamos en ORDERS

        if (!Utils.isToyAvailable(toyData)) {
            return Utils.createError("El producto no se encuentra disponible");
        }

        EntityResult orderResult = Utils.insertOrder(daoHelper, orderDao, orderData);

        if (orderResult.isWrong()) {
            return Utils.createError("Error al crear la orden");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 4)

        EntityResult toyUpdateResult = Utils.updateToyStatus(daoHelper, toyDao, toyId, ToyDao.STATUS_PURCHASED);

        if (toyUpdateResult.isWrong()) {
            return Utils.createError("Error al actualizar el transaction_status");
        }

        return Utils.createMessageResult("Orden creada correctamente");
    }

    @Override
    public EntityResult sumPriceToysSoldQuery(Map<String, Object> keyMap, List<String> attrList)
            throws OntimizeJEERuntimeException{

            return this.daoHelper.query(toyDao,keyMap,attrList,ToyDao.QUERY_V_SUM_PRICE_TOYS_SOLD);
    }

    @Override
    public EntityResult userAverageRatingQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(surveyDao,keyMap,attrList, SurveyDao.QUERY_USER_AVG_RATING);
    }
}