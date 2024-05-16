package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.dto.EntityResultMapImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.campusdual.cd2024bfs3g1.openapi.core.service.ITestApi;

@RequestMapping("/test")
@RestController
public class TestRestController  {

	@GetMapping()
	public ResponseEntity<EntityResult> testRest() {
		EntityResult result = new EntityResultMapImpl();
		result.put("resultado", "It Works");
		return new ResponseEntity<>(result, HttpStatus.OK);
	}


}
