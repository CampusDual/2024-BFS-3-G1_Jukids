package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IStatusService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statuses")
public class StatusRestController extends ORestController<IStatusService> {
    @Autowired
    private IStatusService statusService;

    @Override
    public IStatusService getService() {
        return this.statusService;
    }
}
