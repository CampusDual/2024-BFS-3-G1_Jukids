package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IPaymentService;
import com.ontimize.jee.common.dto.EntityResult;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    IPaymentService paymentService;

    //@PostMapping(value = "/paymentIntent")
    @RequestMapping(value = "/paymentIntent", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EntityResult> payment(@RequestBody HashMap<String, Object> paymentData) throws StripeException {
        return new ResponseEntity<EntityResult>(paymentService.paymentIntent(paymentData), HttpStatus.OK);
    }

    //@PostMapping("/confirm/{id}")
    //public ResponseEntity<String> confirm(@PathVariable("id") String id) throws StripeException {
    // PaymentIntent paymentIntent = paymentService.confirm(id);
    //String paymentStr = paymentIntent.toJson();
    //return new ResponseEntity<String>(paymentStr, HttpStatus.OK);
    //}

    //@PostMapping("/confirm/{id}")
    @RequestMapping( value = "/confirm/{id}", method = RequestMethod.POST )
    public ResponseEntity<EntityResult> confirm( @PathVariable("id") String id, @RequestBody HashMap<String, Object> cardToken ) throws StripeException {
        System.out.println("ID :" + id );
        return new ResponseEntity<EntityResult>(paymentService.confirm(id, cardToken), HttpStatus.OK);
    }

    //@PostMapping("/cancel/{id}")
    @RequestMapping( value = "/cancel/{id}", method = RequestMethod.POST )
    public ResponseEntity<EntityResult> cancel(@PathVariable("id") String id) throws StripeException {
        return new ResponseEntity<EntityResult>(paymentService.cancel(id), HttpStatus.OK);
    }
}
