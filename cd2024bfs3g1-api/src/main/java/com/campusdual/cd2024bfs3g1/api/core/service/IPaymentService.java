package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;

import java.util.HashMap;
import java.util.Map;

public interface IPaymentService {

    EntityResult createStripeCustomer(String emailBuyer, String emailSeller) throws StripeException;

    EntityResult createCheckoutSession(HashMap<String, Object> checkoutData) throws StripeException;

    EntityResult checkSessionStatus(String session_id);

    EntityResult sessionStatusUpdate(Map<String, Object> attrMap, Map<String, Object> keyMap);

}
