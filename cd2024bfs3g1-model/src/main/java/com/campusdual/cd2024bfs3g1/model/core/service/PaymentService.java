package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PaymentService implements IPaymentService {
    @Value("${stripe.secret-key}")
    String secretKey;

    @Value("${environment.url}")
    String baseUrl;

    @Autowired
    IToyService toyService;

    //Método para crear un ID único de Cliente a la hora de realizar el pago, recoge email en el pago y accede al email
    // del vendedor mediante el id del juguete que se compra, genera un ID del comprador que va incluido en el Token de pago
    // para mostrar en el Dashboard de Stripe en la seccion "Cliente".
    public EntityResult createStripeCustomer(String emailBuyer, String emailSeller) throws StripeException {
        Stripe.apiKey = secretKey;

        Map<String, Object> customerData = new HashMap <>();
        customerData.put("buyer", emailBuyer);
        customerData.put("email",ToyDao.ATTR_EMAIL);

        Customer customer = Customer.create(customerData);
        EntityResult finalCustomer = new EntityResultMapImpl();
        finalCustomer.put("customerId", customer.getId());
        finalCustomer.put("customer", customer.toJson());
        return finalCustomer;
    }

    @Override
    public EntityResult createCheckoutSession( HashMap<String, Object> checkoutData) throws StripeException {

        Stripe.apiKey = secretKey;

        Integer toyid = null;
        String toyUrl = null;
        if(checkoutData.containsKey(ToyDao.ATTR_ID)){
            toyid = (Integer) checkoutData.remove(ToyDao.ATTR_ID);
        }
        if(checkoutData.containsKey("toyUrl")) {
            toyUrl = (String) checkoutData.remove("toyUrl");
        }

        HashMap<String, Object> getProdQuery = new HashMap<>();

        getProdQuery.put( ToyDao.ATTR_ID, toyid);

        System.out.println("================= PRODUCT ID: " + toyid );

        //Consulta
        EntityResult result = toyService.toyQuery(
                getProdQuery,
                Arrays.asList( ToyDao.ATTR_NAME, ToyDao.ATTR_DESCRIPTION, ToyDao.ATTR_PRICE, ToyDao.ATTR_PHOTO )
        );

        if( result.isWrong() ) {
            //Error
            return result;
        }

        if(result.isEmpty()) {
            EntityResult errorResult = new EntityResultMapImpl();
            errorResult.setCode( EntityResult.OPERATION_WRONG );
            errorResult.setMessage("Error: No se encontró el producto.");
            return errorResult;
        }

        System.out.println("BASE URL ============> " + baseUrl);


        //Producto encontrado

        HashMap<String, Object> toyData = (HashMap<String, Object>) result.getRecordValues(0);

        System.out.println(toyData.get( ToyDao.ATTR_NAME ) );
        System.out.println(toyData.get( ToyDao.ATTR_DESCRIPTION ) );
        System.out.println(toyData.get( ToyDao.ATTR_PRICE ) );
        //System.out.println(toyData.get( ToyDao.ATTR_PHOTO ) );  //Demasiado grande para pasar como argumento
        System.out.println("TOYURL: " + toyUrl);

//
//        System.out.println( "ENTITY RESULT TOY: " + toy);

        SessionCreateParams params =
                SessionCreateParams.builder()
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("EUR")
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName(
                                                                                (String) toyData.get( ToyDao.ATTR_NAME )
                                                                        )
                                                                        .setDescription(
                                                                                (String) toyData.get( ToyDao.ATTR_DESCRIPTION )
                                                                        )
                                                                        .addImage(
                                                                                "https://st4.depositphotos.com/2495409/19919/i/450/depositphotos_199193024-stock-photo-new-product-concept-illustration-isolated.jpg"
                                                                        )
                                                                        .build()
                                                        )
                                                        .setUnitAmount(
                                                                ( ( (Number) toyData.get( ToyDao.ATTR_PRICE ) ).longValue() * 100 ) //Precio
                                                        )
                                                        .build()
                                        )
                                        .setQuantity(1L) //Cantidad del producto
                                        .build()
                        )
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
                        .setReturnUrl( baseUrl + "checkout?session_id={CHECKOUT_SESSION_ID}")
                        .build();


        Session session = Session.create(params);


        EntityResult checkoutSession = new EntityResultMapImpl();
        checkoutSession.put("session", session.toJson());

        return checkoutSession;
    }
}
