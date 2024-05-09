package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService implements IPaymentService {
    @Value("${stripe.secret-key}")
    String secretKey;

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

    public EntityResult confirm (String id) throws StripeException {
        Stripe.apiKey = secretKey;
        PaymentIntent paymentIntent = PaymentIntent.retrieve(id);
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
}
