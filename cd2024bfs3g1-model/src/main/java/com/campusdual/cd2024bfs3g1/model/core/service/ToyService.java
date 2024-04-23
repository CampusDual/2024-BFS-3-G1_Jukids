package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.ontimize.jee.common.dto.EntityResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;

import java.util.List;
import java.util.Map;

@Lazy
@Service("ToyService")
public class ToyService implements IToyService {

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;
    @Autowired
    private ToyDao toyDao;

    @Override
    public EntityResult toyQuery(Map<String, Object> keyMap, List<String> attrList) {
        return this.daoHelper.query(this.toyDao, keyMap, attrList);
    }

    @Override
    public EntityResult toyInsert(Map<String, Object> attributes) {
        return this.daoHelper.insert(this.toyDao, attributes);
    }

    @Override
    public EntityResult toyUpdate(Map<String, Object> attributes, Map<String, Object> KeyValues) {
        return this.daoHelper.update(this.toyDao, attributes, KeyValues);
    }

    @Override
    public EntityResult toyDelete(Map<String, Object> keyValues) {
        return this.daoHelper.delete(this.toyDao, keyValues);
    }
}
