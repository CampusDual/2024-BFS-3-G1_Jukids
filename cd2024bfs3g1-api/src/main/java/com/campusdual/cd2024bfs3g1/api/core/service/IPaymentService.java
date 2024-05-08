package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;

import java.util.HashMap;

public interface IPaymentService {
    public EntityResult paymentIntent (HashMap<String, Object> paymentData) throws StripeException;
}
