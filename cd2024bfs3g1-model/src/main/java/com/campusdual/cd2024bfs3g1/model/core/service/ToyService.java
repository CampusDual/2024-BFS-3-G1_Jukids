package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("ToyService")
@Lazy
public class ToyService implements IToyService {

    @Autowired
    private ToyDao toyDao;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) throws OntimizeJEERuntimeException {
        keyMap.put("transaction_status", ToyDao.STATUS_AVAILABLE);
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
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

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 1)

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

    private EntityResult createError(String mensaje){

        EntityResult errorEntityResult = new EntityResultMapImpl();
        errorEntityResult.setCode(EntityResult.OPERATION_WRONG);
        errorEntityResult.setMessage(mensaje);

        return errorEntityResult;
    }

}