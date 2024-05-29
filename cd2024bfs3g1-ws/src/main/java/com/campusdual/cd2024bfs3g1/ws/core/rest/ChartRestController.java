package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.ontimize.jee.common.dto.EntityResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.campusdual.cd2024bfs3g1.api.core.service.IChartService;

import com.ontimize.jee.server.rest.ORestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/charts")
public class ChartRestController extends ORestController<IChartService>{
    @Autowired
    private IChartService chartService;

    @Override
    public IChartService getService() {
        return this.chartService;
    }
}
