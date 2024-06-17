package com.campusdual.cd2024bfs3g1.model.core.schedule;

import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ShipmentDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class CheckPaymentSchedule {

    @Autowired
    private OrderDao orderDao;
    @Autowired
    private ToyDao toyDao;
    @Autowired
    private ShipmentDao shipmentDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Scheduled(fixedRate = 60000)
    public void checkPayments() {

        //Query de todas las Orders con Session_id nulo (no pagadas)

        LocalDateTime now = LocalDateTime.now();

        Map<String, Object> keyMap = new HashMap<>();
        List<String> attrList = Arrays.asList(OrderDao.ATTR_ID, OrderDao.ATTR_ORDER_DATE, ToyDao.ATTR_ID, ShipmentDao.ATTR_ID);

        EntityResult queryResult = daoHelper.query(orderDao, keyMap, attrList, OrderDao.QUERY_UNPAID_ORDERS);

        int numeroDeObjetos = queryResult.calculateRecordNumber();

        for (int i = 0; i < numeroDeObjetos; i++) {
            Map<String, Object> order = queryResult.getRecordValues(i);
            Timestamp orderTimestamp = (Timestamp) order.get(OrderDao.ATTR_ORDER_DATE);
            LocalDateTime orderDate = orderTimestamp.toLocalDateTime();

            //De las orders sin pagar comprobamos las que lleven creadas mas de 31 minutos sin pagarse

            if (orderDate.plusMinutes(31).isBefore(now)) {

                int toyId = (int) order.get(ToyDao.ATTR_ID);
                int orderId = (int) order.get(OrderDao.ATTR_ID);
                Integer shipmentId = (Integer) order.get(ShipmentDao.ATTR_ID);

                if (shipmentId != null) {

                    //Borramos el shipment asociado a order_id si existe

                    Map<String, Object> shipmentKeyMap = new HashMap<>();
                    shipmentKeyMap.put(ShipmentDao.ATTR_ID, shipmentId);
                    daoHelper.delete(shipmentDao, shipmentKeyMap);
                }

                //Borramos el order asociado al toyId

                Map<String, Object> orderKeyMap = new HashMap<>();
                orderKeyMap.put(OrderDao.ATTR_ID, orderId);
                daoHelper.delete(orderDao, orderKeyMap);

                //Devolvemos toy transaction_status a 0

                Utils.updateToyStatus(daoHelper, toyDao, toyId, ToyDao.STATUS_AVAILABLE);
            }
        }
    }
}