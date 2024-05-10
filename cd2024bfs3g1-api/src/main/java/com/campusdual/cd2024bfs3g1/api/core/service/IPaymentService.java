package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.util.HashMap;

public interface IPaymentService {
    EntityResult paymentIntent(HashMap<String, Object> paymentData) throws StripeException;

    EntityResult confirm(String id, HashMap<String, Object> cardToken ) throws StripeException;

    EntityResult cancel(String id) throws StripeException;
}
