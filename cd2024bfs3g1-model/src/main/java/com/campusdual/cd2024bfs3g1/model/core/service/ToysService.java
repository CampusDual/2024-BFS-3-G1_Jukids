package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.api.core.service.IToysService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToysDao;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.common.exceptions.OntimizeJEERuntimeException;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service("ToysService")
@Lazy
public class ToysService implements IToysService {

    @Autowired
    private ToysDao toysDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public EntityResult toyInsert(Map<String, Object> attrMap) throws OntimizeJEERuntimeException {
        return this.daoHelper.insert(this.toysDao, attrMap);
    }

}
