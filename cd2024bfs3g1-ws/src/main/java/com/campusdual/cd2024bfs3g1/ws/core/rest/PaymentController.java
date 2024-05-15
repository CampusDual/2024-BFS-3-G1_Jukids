package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    IPaymentService paymentService;

    // CheckoutSession de Stripe
    @RequestMapping( value = "/create-checkout-session", method = RequestMethod.POST )
    public ResponseEntity<EntityResult> checkoutSession(
            @RequestBody HashMap<String, Object> checkoutData
    ) throws StripeException {
        return new ResponseEntity<EntityResult>(  paymentService.createCheckoutSession( checkoutData ), HttpStatus.OK );
    }

    @RequestMapping( value = "/session-status", method = RequestMethod.GET )
    public ResponseEntity<EntityResult> checkSessionStatus(
            @RequestParam String session_id
    ) throws StripeException {
        return new ResponseEntity<>(paymentService.checkSessionStatus(session_id), HttpStatus.OK);
    }

}