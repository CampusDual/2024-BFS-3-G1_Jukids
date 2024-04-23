package com.campusdual.cd2024bfs3g1.api.core.service;

import com.ontimize.jee.common.dto.EntityResult;

import java.util.List;
import java.util.Map;

public interface IToyService {
    public EntityResult toyQuery(Map<String, Object> keysValues, List<String> attributes) ;
    public EntityResult toyInsert(Map<String, Object> attributes) ;
    public EntityResult toyUpdate(Map<String, Object> attributes, Map<String, Object> KeyValues) ;
    public EntityResult toyDelete(Map<String, Object> keyValues) ;

}
