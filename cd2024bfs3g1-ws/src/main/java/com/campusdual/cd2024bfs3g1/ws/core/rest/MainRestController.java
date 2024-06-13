package com.campusdual.cd2024bfs3g1.ws.core.rest;

import com.campusdual.cd2024bfs3g1.api.core.service.IToyService;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.campusdual.cd2024bfs3g1.model.utils.Utils;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.campusdual.cd2024bfs3g1.api.core.service.IMainService;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class MainRestController {
	private static final String ENV_JS = "(function (window) {\n" +
			"  window.__env = window.__env || {};\n" +
			"  // API url\n" +
			"  window.__env.apiUrl = '%API_URL%';\n" +
			"}(this));";

	@Autowired
	private IMainService mainService;

	@Autowired
	private IToyService toyService;
	@Autowired
	private UserDao userDao;
	@Autowired
	private DefaultOntimizeDaoHelper daoHelper;

	@GetMapping(value = "/main", produces = MediaType.APPLICATION_JSON_VALUE)
	public String main() {
		return "index";
	}

	@GetMapping(value = "/app/env/env.js", produces = "application/javascript")
	public @ResponseBody String env() {
		return ENV_JS.replace("%API_URL%", this.mainService.getMainUrl() != null ? this.mainService.getMainUrl() : "");
	}

	@GetMapping("/restapi/get-image")
	@ResponseBody
	public ResponseEntity<?> getImageDynamicType(
			@RequestParam( required = false, value = "toyId") Integer toyId,
			@RequestParam( required = false, value = "userId") Integer userId

	) throws IOException {

		HashMap<String, Object> imageServiceResponse = null;

		try {
			HashMap<String, Object> dataResponse = new HashMap<>();
			if( toyId != null ) {
				//Consulta a la DB para obtener la imagen.
				HashMap<String, Object> getProdQuery = new HashMap<>();

				getProdQuery.put( ToyDao.ATTR_ID, toyId);

				//Consulta
				EntityResult result = toyService.toyQuery(
						getProdQuery,
						Arrays.asList( ToyDao.ATTR_NAME, ToyDao.ATTR_PHOTO )
				);

				dataResponse = (HashMap<String, Object>) result.getRecordValues(0);
			} else {
				//Consulta a la DB para obtener la imagen.
				//Where
				Map<String, Object> keyMap = new HashMap<>();
				keyMap.put(UserDao.USR_ID, userId );

				//Columns
				List<String> attrList = Arrays.asList(
						UserDao.NAME,
						UserDao.PHOTO
				);

				//Consulta
				EntityResult result = this.daoHelper.query( this.userDao,keyMap, attrList );

				dataResponse = (HashMap<String, Object>) result.getRecordValues(0);
			}



			if(!dataResponse.isEmpty() ){
				imageServiceResponse = Utils.imageService( dataResponse );
			}

			MediaType contType = (MediaType) imageServiceResponse.get("contentType");
			byte[] decBytes = (byte[]) imageServiceResponse.get("decodedBytes");


			//Devolución de imagen solicitada.
			return ResponseEntity.ok()
					.contentType( contType )
					.body( decBytes );


		} catch (Exception ex ){

			return ResponseEntity.badRequest()
					.contentType(MediaType.APPLICATION_JSON)
					.body(ex.getMessage());
		}


	}
}
