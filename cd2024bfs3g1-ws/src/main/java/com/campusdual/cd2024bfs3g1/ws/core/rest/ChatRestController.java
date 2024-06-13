package com.campusdual.cd2024bfs3g1.ws.core.rest;


import com.campusdual.cd2024bfs3g1.api.core.service.IChatLogService;
import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatRestController extends ORestController<IChatLogService> {

    @Autowired
    private IChatLogService chatLogService;


    @Override
    public IChatLogService getService() {
        return this.chatLogService;
    }
}
