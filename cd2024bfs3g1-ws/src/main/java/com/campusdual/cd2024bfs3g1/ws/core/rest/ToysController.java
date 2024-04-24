package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IToysService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/toys")
public class ToysController extends ORestController<IToysService> {

    @Autowired
    private IToysService toysService;
    @Override
    public IToysService getService() {
        return this.toysService;
    }
}
