package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import com.ontimize.jee.server.rest.ORestController;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/payments")
public class PaymentController extends ORestController<IPaymentService> {

    @Autowired
    IPaymentService paymentService;

    // CheckoutSession de Stripe
    @RequestMapping( value = "/create-checkout-session", method = RequestMethod.POST )
    public ResponseEntity<EntityResult> checkoutSession(
            @RequestBody HashMap<String, Object> checkoutData
    ) throws StripeException {

        ResponseEntity<EntityResult> response;

        try {
            response =  new ResponseEntity<>(paymentService.createCheckoutSession( checkoutData ), HttpStatus.OK);

        } catch ( StripeException stripeException ) {


            EntityResult exception = new EntityResultMapImpl();
            exception.put( "error", stripeException.getStripeError().getMessage() );
            response = new ResponseEntity<>(exception, HttpStatus.BAD_REQUEST);
        }

        return response;
    }

    @RequestMapping( value = "/session-status", method = RequestMethod.GET )
    public ResponseEntity<EntityResult> checkSessionStatus(
            @RequestParam String session_id
    ) throws StripeException {
        return new ResponseEntity<>(paymentService.checkSessionStatus(session_id), HttpStatus.OK);
    }

    @Override
    public IPaymentService getService() {
        return this.paymentService;
    }
}