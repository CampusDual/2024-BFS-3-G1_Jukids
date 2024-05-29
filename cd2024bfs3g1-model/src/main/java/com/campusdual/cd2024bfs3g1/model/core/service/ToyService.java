package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserLocationDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.db.AdvancedEntityResult;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import com.ontimize.jee.server.dao.IOntimizeDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("ToyService")
@Transactional(readOnly = true)
@Lazy
public class ToyService implements IToyService {

    public static final int MINUTES = 10;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserLocationDao userLocationDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
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
    public AdvancedEntityResult toyPaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy) {

        //Logica de posision de distancia.

        //Rearmar el XML toyPaginationQuery basado en la vista realizada.

        //Retornar el resultado.

        return this.daoHelper.paginationQuery(this.toyDao, keysValues, attributes, recordNumber, startIndex, orderBy, "default");
    }

    @Override
    public AdvancedEntityResult toyAvailablePaginationQuery(Map<String, Object> keysValues, List<?> attributes, int recordNumber, int startIndex, List<?> orderBy) {

        System.out.println("toyAvailablePaginationQuery DATA keysValues: " + keysValues);
        System.out.println("toyAvailablePaginationQuery DATA attributes: " + attributes);

        //Logica de posision de distancia.

        //Rearmar el XML toyPaginationQuery basado en la vista realizada.

        //Retornar el resultado.

        return this.daoHelper.paginationQuery(this.toyDao, keysValues, attributes, recordNumber, startIndex, orderBy, "default");
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


    private EntityResult searchByDistance(Map<String, Object> keyMap, List<String> attrList) {

        // Borrar todas las localizaciones de mas de 10 minutos.
        HashMap<String, Object> keyMapDelete = new HashMap<>();

        // Obtener la hora actual
        LocalDateTime now = LocalDateTime.now();

        // Restar 10 minutos a la hora actual
        LocalDateTime ten_minutes_before = now.minus(Duration.ofMinutes(MINUTES));

        //Se agrega la consulta a realizar con condicional de "menor que.."
        keyMapDelete.put( UserLocationDao.ATTR_INSERTED_DATE, new SearchValue( SearchValue.LESS, ten_minutes_before ));

        //EntityResult delete_result = this.daoHelper.delete(this.userLocationDao, keyMapDelete );

//        if (delete_result.isWrong() ) {
//            return  delete_result;
//        }

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


}