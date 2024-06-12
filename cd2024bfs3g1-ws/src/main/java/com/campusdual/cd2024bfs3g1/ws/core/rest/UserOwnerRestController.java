package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IUserOwnerService;
import com.ontimize.jee.server.rest.ORestController;
import liquibase.pro.packaged.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/userowner")
public class UserOwnerRestController extends ORestController<IUserOwnerService> {
    @Autowired
    private IUserOwnerService userOwnerService;
    @Override
    public IUserOwnerService getService() {
        return this.userOwnerService;
    }
}
