package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ontimize.jee.server.rest.ORestController;

@RestController
@RequestMapping("/toys")
public class ToyRestController extends ORestController<IToyService> {

    @Autowired
    private IToyService toyService;

    @Override
    public IToyService getService() {
        return this.toyService;
    }


}