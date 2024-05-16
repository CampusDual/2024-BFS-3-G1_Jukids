package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import java.util.HashMap;

public interface IPaymentService {

    EntityResult createStripeCustomer(String emailBuyer, String emailSeller) throws StripeException;

    EntityResult createCheckoutSession( HashMap<String, Object> checkoutData ) throws StripeException;

    EntityResult checkSessionStatus( String session_id ) throws StripeException;

}
