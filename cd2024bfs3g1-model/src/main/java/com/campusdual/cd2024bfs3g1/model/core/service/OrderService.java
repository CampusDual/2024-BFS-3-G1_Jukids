package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IOrderService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.common.gui.SearchValue;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;


@Service("OrderService")
@Lazy
public class OrderService implements IOrderService {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private ShipmentDao shipmentDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    public EntityResult orderQuery(Map<String, Object> keyMap, List<String> attrList) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);
        keyMap.put(OrderDao.ATTR_BUYER_ID, idUser);
        return this.daoHelper.query(this.orderDao, keyMap, attrList);
    }

    @Override
    public EntityResult purchasedQuery(Map<String, Object> keyMap, List<String> attrList) {

        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);
        keyMap.put(OrderDao.ATTR_BUYER_ID, idUser);
        keyMap.put(ToyDao.ATTR_TRANSACTION_STATUS,
                new SearchValue(SearchValue.IN, Arrays.asList(ToyDao.STATUS_PURCHASED, ToyDao.STATUS_RATED)));

        return this.daoHelper.query(this.orderDao, keyMap, attrList, OrderDao.QUERY_JOIN_ORDERS_TOYS);
    }

    @Override
    @Transactional
    public EntityResult orderInsert(Map<String, Object> orderData) {

        String email = Utils.getAuthenticatedEmail();
        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        //Poblamos orderData, el HashMap que usaremos para el insert en ORDERS

        Utils.populateOrderData(orderData, idUser, email);

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        Integer toyId = (Integer) orderData.get(OrderDao.ATTR_TOY_ID);
        EntityResult toyData = Utils.fetchToyData(daoHelper, toyDao, toyId);
        if (toyData.isWrong() || toyData.isEmpty()) {
            return Utils.createError("Error al recuperar el precio del juguete!");
        }

        //Calculamos ORDER - TOTAL_PRICE

        double totalPrice = Utils.calculateTotalPrice(toyData);
        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

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
    @Transactional
    public EntityResult orderAndShipmentInsert(Map<String, Object> shipmentData) {

        //Extraemos el TOY - TOYID que viene guardado en el campo SHIPMENT - ORDER_ID desde front

        Integer toyId = (Integer) shipmentData.remove(ShipmentDao.ATTR_ORDER_ID);

        //Recuperamos ORDER - BUYER_ID, BUYER_EMAIL
        //Generamos ORDER - ORDER_DATE

        String email = Utils.getAuthenticatedEmail();
        Integer idUser = (Integer) Utils.idGetter(daoHelper, userDao);

        //Creamos y poblamos orderData, el HashMap que usaremos para el insert en ORDERS

        Map<String, Object> orderData = new HashMap<>();
        Utils.populateOrderShipData(orderData, idUser, email, toyId);

        //Recuperamos TOY - PRICE y TOY - TRANSACTION_STATUS

        EntityResult toyData = Utils.fetchToyData(daoHelper, toyDao, toyId);

        if (toyData.isWrong() || toyData.isEmpty()) {
            return Utils.createError("Error al recuperar el precio del juguete!");
        }

        //Recuperamos SHIPMENTS - PRICE
        //Calculamos ORDER - TOTAL_PRICE

        double shipmentPrice = Utils.getShipmentPrice(shipmentData);
        double totalPrice = Utils.calculateTotalPriceWithShipment(toyData, shipmentPrice);
        orderData.put(OrderDao.ATTR_TOTAL_PRICE, totalPrice);

        //Verificamos disponibilidad del juguete e insertamos en ORDERS

        if (!Utils.isToyAvailable(toyData)) {
            return Utils.createError("El producto no se encuentra disponible");
        }

        EntityResult orderResult = Utils.insertOrder(daoHelper, orderDao, orderData);

        if (orderResult.isWrong()) {
            return Utils.createError("Error al crear la orden");
        }

        //Recuperamos ORDERS - ORDER_ID
        //Asignamos el verdadero SHIPMENTS - ORDER_ID

        shipmentData.put("order_id", orderResult.get(OrderDao.ATTR_ID));

        //Insertamos en SHIPMENTS

        EntityResult shipmentResult = Utils.insertShipment(daoHelper, shipmentDao, shipmentData);

        if (shipmentResult.isWrong()) {
            return Utils.createError("Error al crear el envío");
        }

        //Actualizamos TOYS - TRANSACTION_STATUS (0 -> 1)

        EntityResult toyUpdateResult = Utils.updateToyStatus(daoHelper, toyDao, toyId, ToyDao.STATUS_PENDING_SHIPMENT);

        if (toyUpdateResult.isWrong()) {
            return Utils.createError("Error al actualizar el transaction_status");
        }

        return Utils.createMessageResult("Orden y envío creados correctamente");
    }
}