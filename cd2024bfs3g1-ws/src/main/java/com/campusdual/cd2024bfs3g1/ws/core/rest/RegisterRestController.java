package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IRegisterService;
import com.campusdual.cd2024bfs3g1.model.core.service.RegisterService;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.rest.ORestController;
import org.junit.validator.PublicClassValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.awt.*;
import java.util.Map;

@RestController
@RequestMapping("/registers")
public class RegisterRestController extends ORestController<IRegisterService> {

    @Autowired
    private IRegisterService registerService;

    @Override
    public IRegisterService getService() {
        return this.registerService;
    }
}
