package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyOwnerService;
import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

    @RestController
    @RequestMapping("/toyowner")
    public class ToyOwnerRestController extends ORestController<IToyOwnerService> {

        @Autowired
        private IToyOwnerService toyOwnerService;

        @Override
        public IToyOwnerService getService() {
            return this.toyOwnerService;
        }

    }
