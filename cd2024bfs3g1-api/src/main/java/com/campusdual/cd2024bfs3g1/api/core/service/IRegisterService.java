package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;

import java.util.Map;

public interface IRegisterService {
    EntityResult registerInsert(Map<?, ?> attrMap) throws OntimizeJEERuntimeException;
}
