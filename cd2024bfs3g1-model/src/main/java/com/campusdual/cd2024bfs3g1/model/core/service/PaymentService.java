package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.OrderDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.LineItem;
import com.stripe.model.LineItemCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionListLineItemsParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.datatransfer.Clipboard;
import java.math.BigDecimal;
import java.util.*;

@Service("PaymentService")
public class PaymentService implements IPaymentService {
    @Value("${stripe.secret-key}")
    String secretKey;
    @Value("${environment.url}")
    String baseUrl;
    @Autowired
    IToyService toyService;
    @Autowired
    private OrderDao orderDao;
    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    //Método para crear un ID único de Cliente a la hora de realizar el pago, recoge email en el pago y accede al email
    // del vendedor mediante el id del juguete que se compra, genera un ID del comprador que va incluido en el Token de pago
    // para mostrar en el Dashboard de Stripe en la seccion "Cliente".
    public EntityResult createStripeCustomer(String emailBuyer, String emailSeller) throws StripeException {
        Stripe.apiKey = secretKey;

        Map<String, Object> customerData = new HashMap<>();
        customerData.put("buyer", emailBuyer);
        customerData.put("email", ToyDao.ATTR_EMAIL);

        Customer customer = Customer.create(customerData);
        EntityResult finalCustomer = new EntityResultMapImpl();
        finalCustomer.put("customerId", customer.getId());
        finalCustomer.put("customer", customer.toJson());
        return finalCustomer;
    }

    @Override
    public EntityResult createCheckoutSession(HashMap<String, Object> checkoutData) throws StripeException {

        Stripe.apiKey = secretKey;

        Integer toyid = null;
        String toyUrl = null;
        boolean shipment = false;

        EntityResult checkoutSession = new EntityResultMapImpl();

        try {
            if (checkoutData.containsKey(ToyDao.ATTR_ID)) {
                toyid = (Integer) checkoutData.remove(ToyDao.ATTR_ID);
            }
            if (checkoutData.containsKey("toyUrl")) {
                toyUrl = (String) checkoutData.remove("toyUrl");
            }
            if (checkoutData.containsKey(ToyDao.ATTR_SHIPPING)) {
                shipment = (boolean) checkoutData.remove(ToyDao.ATTR_SHIPPING);
            }

            HashMap<String, Object> getProdQuery = new HashMap<>();

            getProdQuery.put(ToyDao.ATTR_ID, toyid);


            //Consulta
            EntityResult result = toyService.toyQuery(
                    getProdQuery,
                    Arrays.asList(ToyDao.ATTR_NAME, ToyDao.ATTR_DESCRIPTION, ToyDao.ATTR_PRICE, ToyDao.ATTR_PHOTO)
            );

            if (result.isWrong()) {
                //Error
                return result;
            }

            if (result.isEmpty()) {
                EntityResult errorResult = new EntityResultMapImpl();
                errorResult.setCode(EntityResult.OPERATION_WRONG);
                errorResult.setMessage("Error: No se encontró el producto.");
                return errorResult;
            }

            //Producto encontrado

            HashMap<String, Object> toyData = (HashMap<String, Object>) result.getRecordValues(0);

            // Recuperar dato de precio
            BigDecimal price = (BigDecimal) toyData.get(ToyDao.ATTR_PRICE);
            //multipicar x 100
            price = price.multiply(new BigDecimal(100));
            //Creamos variable de comision igual a 100 menos la comision deseada
            BigDecimal commissionRate = BigDecimal.valueOf(0.93);
            price = price.divide(commissionRate, 4);

            //Comprobamos si el checkout incluye Shipment y en caso afirmativo le añadimos 3 euros
            if (shipment) {
                price = price.add(new BigDecimal(300));
            }

            SessionCreateParams params = SessionCreateParams.builder().addLineItem(SessionCreateParams.
                            LineItem.builder().setPriceData(SessionCreateParams.LineItem.PriceData.builder().
                                    setCurrency("EUR").setProductData(SessionCreateParams.LineItem.PriceData.ProductData
                                            .builder().setName((String) toyData.get(ToyDao.ATTR_NAME)).setDescription((String)
                                                    toyData.get(ToyDao.ATTR_DESCRIPTION))
                                            .addImage(baseUrl + "restapi/get-image?toyId=" + toyid).build())
                                    .setUnitAmount(price.longValue()) //Precio
                                    .build()).setQuantity(1L) //Cantidad del producto
                            .build()).setMode(SessionCreateParams.Mode.PAYMENT).setUiMode(SessionCreateParams.UiMode.EMBEDDED)
                    .setReturnUrl(baseUrl + "checkout?session_id={CHECKOUT_SESSION_ID}").build();

            Session session = Session.create(params);
            checkoutSession.put("session", session.toJson());

        } catch (Exception ex) {
            throw ex;

        }

        return checkoutSession;
    }

    public EntityResult checkSessionStatus(String session_id) throws StripeException {
        Stripe.apiKey = secretKey;
        EntityResult resultStatus = new EntityResultMapImpl();

        try {
            Session session = Session.retrieve(session_id);

            Map<String, Object> sessionData = new HashMap<>();
            sessionData.put("session_id", session.getId());
            sessionData.put("status", session.getStatus());

            SessionListLineItemsParams params = SessionListLineItemsParams.builder().build();
            LineItemCollection lineItems = session.listLineItems(params);

            Map<String, Object> itemDetails = new HashMap<>();

            for (LineItem lineItem : lineItems.getData()) {
                String itemId = lineItem.getId();
                String itemName = lineItem.getDescription();
                Long itemPrice = lineItem.getAmountTotal();
                Number itemQty = lineItem.getQuantity();
                String currency = lineItem.getCurrency();


                itemDetails.put("id", itemId);
                itemDetails.put("name", itemName);
                itemDetails.put("price", itemPrice);
                itemDetails.put("quantity", itemQty);
                itemDetails.put("currency", currency);
            }
            sessionData.put("product_details", itemDetails);

            resultStatus.putAll(sessionData);

            //En caso de pago correcto, añadimos el session_id a la order correspondiente

            Integer toyId = (Integer) itemDetails.get("id");
            System.out.println(toyId + (" ") + session.getId());
            Map<String, Object> keyMap = new HashMap<>();
            keyMap.put(OrderDao.ATTR_TOY_ID, toyId);
            Map<String, Object> updateMap = new HashMap<>();
            updateMap.put(OrderDao.ATTR_SESSION_ID, session.getId());
            EntityResult updateResult = daoHelper.update(orderDao, updateMap, keyMap);

            if (updateResult.isWrong()) {
                return Utils.createError("Error al actualizar el session_id de la orden");
            }

        } catch (StripeException e) {
            resultStatus.put("error", e.getMessage());
        }

        return resultStatus;
    }
}
