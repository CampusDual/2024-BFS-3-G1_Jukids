package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserLocationDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.db.AdvancedEntityResultMapImpl;
import com.ontimize.jee.common.db.SQLStatementBuilder;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
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

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    @Override
    public AdvancedEntityResult toyPaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy) {

        //Logica de posision de distancia.

        //Rearmar el XML toyPaginationQuery basado en la vista realizada.

        //Retornar el resultado.

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

    @Override
    public EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {

        if(((Number) attrMap.get("price")).floatValue() < 0){
            EntityResult errorPrice = new EntityResultMapImpl();
            errorPrice.setCode(EntityResult.OPERATION_WRONG);
            errorPrice.setMessage("El precio no puede ser negativo");
            return errorPrice;
        }

        if(!Utils.validaEmail((String) attrMap.get("email"))) {
            EntityResult error = new EntityResultMapImpl();
            error.setCode(EntityResult.OPERATION_WRONG);
            error.setMessage("El correo electrónico no es correcto");
            return error;
        }
        return this.daoHelper.insert(this.toyDao, attrMap);
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

        orderData.put(OrderDao.ATTR_ORDER_DATE, LocalDateTime.now());

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        Integer toyId = (Integer) orderData.get(OrderDao.ATTR_TOY_ID);
        String userEmail = (String) orderData.get(OrderDao.ATTR_BUYER_EMAIL);

        HashMap<String, Object> toyKeyValues = new HashMap<>();
        toyKeyValues.put(ToyDao.ATTR_ID, toyId);
        List<String> toyAttributes = Arrays.asList(ToyDao.ATTR_PRICE, ToyDao.ATTR_TRANSACTION_STATUS);
        EntityResult toyData = this.daoHelper.query(toyDao, toyKeyValues, toyAttributes);

        if(toyData.isWrong() || toyData.isEmpty()){

            createError("Error al recuperar el precio del juguete!");
        }

        //Recuperamos TOYS - PRICE y SHIPMENTS - PRICE
        //Calculamos ORDER - TOTAL_PRICE

        double JUKIDS_COMMISSION = 1.07;

        BigDecimal toyPriceDecimal = (BigDecimal) toyData.getRecordValues(0).get(ToyDao.ATTR_PRICE);
        double toyPrice = toyPriceDecimal.doubleValue();

        double totalPrice = toyPrice * JUKIDS_COMMISSION;

        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

        //Verificamos disponibilidad del juguete e insertamos en ORDERS

        Integer available = (Integer)toyData.getRecordValues(0).get(ToyDao.ATTR_TRANSACTION_STATUS);

        if(available != 0){

            return createError("El producto no se encuentra disponible");
        }

        EntityResult orderResult = this.daoHelper.insert(this.orderDao, orderData);

        if (orderResult.isWrong()) {

            return createError("Error al crear la orden");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 4)

        Map<String,Object> updateStatus = new HashMap<>();
        updateStatus.put(ToyDao.ATTR_TRANSACTION_STATUS, ToyDao.STATUS_PURCHASED);
        Map<String,Object> keyMap = new HashMap<>();
        keyMap.put(ToyDao.ATTR_ID, toyId);

        EntityResult toyUpdateResult = this.daoHelper.update(this.toyDao, updateStatus, keyMap);

        if(toyUpdateResult.isWrong()){

            return createError("Error al actualizar el transaction_status");
        }

        EntityResult result = new EntityResultMapImpl();
        result.setMessage("Orden creada correctamente");

        return result;
    }

    @Override
    public EntityResult sumPriceToysSoldQuery(Map<String, Object> keyMap, List<String> attrList)
            throws OntimizeJEERuntimeException{

            return this.daoHelper.query(toyDao,keyMap,attrList,ToyDao.QUERY_V_SUM_PRICE_TOYS_SOLD);
    }

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }

}