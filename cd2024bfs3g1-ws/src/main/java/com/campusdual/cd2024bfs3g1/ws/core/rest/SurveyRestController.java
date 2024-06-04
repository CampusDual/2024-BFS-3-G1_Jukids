package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.ISurveyService;
import com.ontimize.jee.server.rest.ORestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/surveys")
public class SurveyRestController extends ORestController<ISurveyService> {
    @Autowired
    private ISurveyService surveyService;
    @Override
    public ISurveyService getService() {
        return this.surveyService;
    }
}