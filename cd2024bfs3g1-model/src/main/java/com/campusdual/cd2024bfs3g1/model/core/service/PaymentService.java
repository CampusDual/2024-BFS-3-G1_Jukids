package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Token;
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

    @Autowired
    IToyService toyService;




    public EntityResult paymentIntent (HashMap<String, Object> paymentData) throws StripeException {
        Stripe.apiKey = secretKey;
        Integer toyid = null;
        if(paymentData.containsKey(ToyDao.ATTR_ID)){
            toyid = (Integer) paymentData.remove(ToyDao.ATTR_ID);
        }
        ArrayList payment_method_types = new ArrayList<>();
        payment_method_types.add("card");
        paymentData.put("payment_method_types", payment_method_types);
        PaymentIntent result = PaymentIntent.create(paymentData);
        EntityResult finalResult = new EntityResultMapImpl();
        finalResult.put("payment", result.toJson());
        return finalResult;
    }

    public EntityResult confirm (String id, HashMap<String, Object> cardToken) throws StripeException {
        Stripe.apiKey = secretKey;
        //Recuperas pago
        PaymentIntent paymentIntent = PaymentIntent.retrieve(id);

//        //Recuperar info Card
//        Token infoCard = Token.retrieve(
//                cardToken.get("token").toString()
//        );
//

//        //Obtenemos el ID de la tarjeta
//        String cardId = infoCard.getCard().getId();

        /*
        * Por el momento se utiliza "pm_card_visa" para asignacion directa.
        * Se tiene que revisar a futuro el flujo a procucción.
        * */

        //Generar Objeto de confirmacion
        Map<String, Object> params = new HashMap<>();

        params.put("payment_method", "pm_card_visa");
        paymentIntent.confirm(params);
        EntityResult finalConfirm = new EntityResultMapImpl();
        finalConfirm.put("payment", paymentIntent.toJson());
        return finalConfirm;
    }

    public EntityResult cancel (String id) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(id);
        paymentIntent.cancel();
        EntityResult finalCancel = new EntityResultMapImpl();
        finalCancel.put("payment", paymentIntent.toJson());
        return finalCancel;
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
                        .setReturnUrl(toyUrl)
//                        .setSuccessUrl("https://example.com/success")
//                        .setCancelUrl( toyUrl )
                        .build();


        Session session = Session.create(params);


        EntityResult checkoutSession = new EntityResultMapImpl();
        checkoutSession.put("session", session.toJson());


        return checkoutSession;
    }


}
