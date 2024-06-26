package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.model.core.chat.data.SendMessage;
import com.campusdual.cd2024bfs3g1.model.core.chat.data.RecieveMessage;
import com.campusdual.cd2024bfs3g1.model.core.chat.data.UserInfoDataConnect;
import com.campusdual.cd2024bfs3g1.model.core.dao.ChatLogDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.ToyDao;
import com.campusdual.cd2024bfs3g1.model.core.dao.UserDao;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.ontimize.jee.common.dto.EntityResult;
import com.ontimize.jee.server.dao.DefaultOntimizeDaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SocketIOService {
    @Autowired
    private ChatLogService chatLogService;

    @Autowired
    private ToyService toyService;

    @Autowired
    private UserDao userDao;

    @Autowired
    private DefaultOntimizeDaoHelper daoHelper;

    @Autowired
    private SocketIOServer socketServer;


    SocketIOService(SocketIOServer socketServer) {
        this.socketServer=socketServer;

        this.socketServer.addConnectListener(onUserConnectWithSocket);

        this.socketServer.addDisconnectListener(onUserDisconnectWithSocket);

        /**
         * Here we create only one event listener
         * but we can create any number of listener
         * messageSendToUser is socket end point after socket connection user have to send message payload on messageSendToUser event
         */
        this.socketServer.addEventListener("messageSendToUser", RecieveMessage.class, onSendMessage);

        this.socketServer.addEventListener("joinRoom", UserInfoDataConnect.class, onCreateRoom);

        this.socketServer.addEventListener( "leaveRoom", UserInfoDataConnect.class, leaveRoom );

    }


    public ConnectListener onUserConnectWithSocket = new ConnectListener() {
        @Override
        public void onConnect(SocketIOClient client) {

            /*
             *
             * TODO: Al conectarse el usuario REGISTRADO crear la sala acorde al producto TOYID / ID vendedor
             *  Si existe la sala, recuperar los mensajes relacionados de los dos.
             *
             */

             /** INICIO Parametros de Consulta para el SellerData **/

            System.out.println("Client DATA: " + client.getSessionId() );

            System.out.println("Perform operation on user connect in controller");
        }
    };

    public DisconnectListener onUserDisconnectWithSocket = new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {

            try {
                System.out.println("USUARIO : " + client.getSessionId() + " Desconectado. ");
                System.out.println("USUARIO ROOM: " + client.getAllRooms());


                socketServer.getAllClients().forEach( c -> {
                    System.out.println(" socketServer client sessionId: " + c.getSessionId() );
                    System.out.println(" socketServer client rooms: " + c.getAllRooms() );

                });




                System.out.println("Perform operation on user disconnect in controller");
            } catch (Exception ex ){
                System.out.println("Error: " + ex.getMessage() );
            } finally {
                client.disconnect();
            }

        }
    };

    public DataListener<RecieveMessage> onSendMessage = new DataListener<>() {

        @Override
        public void onData(SocketIOClient client, RecieveMessage recieveMessage, AckRequest acknowledge) throws Exception {



            try {
                /** Generación de codigo de Sala -/ CustomerID + "C" + ToyID /- **/
                String room = recieveMessage.getCustomerId() + "C" + recieveMessage.getToyId();

                /** Se crea el objeto de respuesta con createMessageResponse **/
                SendMessage sendMessage =  createMessageResponse( recieveMessage );

                /** Emitimos **/
                socketServer.getRoomOperations( room ).sendEvent("receiveMessage", sendMessage);

                /** Insertamos a ChatLog **/
                Map<String, Object> attrMap = new HashMap<>();
                attrMap.put(ChatLogDao.ATTR_CUSTOMER_ID, recieveMessage.getCustomerId() );
                attrMap.put(ChatLogDao.ATTR_OWNER_ID,  sendMessage.getOwnerId() );
                attrMap.put(ChatLogDao.ATTR_TOY_ID,  recieveMessage.getToyId() );
                attrMap.put(ChatLogDao.ATTR_MSG, recieveMessage.getMessage() );
                attrMap.put( ChatLogDao.ATTR_INSERTED_DATE,  new Date() );
                chatLogService.chatLogInsert( attrMap );

                acknowledge.sendAckData("Message send to target user successfully");

            } catch (Exception ex) {
                System.out.println("ERROR EN INSERCION en Chat_Log");
                acknowledge.sendAckData( ex.getMessage() );
            }


            /**  Esto manda un mensaje a un sender especifico **/

            //socketServer.getBroadcastOperations().sendEvent("test", client, message.getMessage() );

            //socketServer.getRoomOperations( room ).sendEvent("receiveMessage", message);

            // Logging the message
//            System.out.println("Mensaje De: " + message.getFromUser());
//            System.out.println("Enviado A: " + message.getToUser());
//            System.out.println("Mensaje : " + message.getMessage());

            /**
             * After sending message to target user we can send acknowledge to sender
             */
        }
    };

    public DataListener<UserInfoDataConnect> onCreateRoom = new DataListener<>() {
        @Override
        public void onData(SocketIOClient client, UserInfoDataConnect userInfoDataConnect, AckRequest ackRequest) throws Exception {

            //Generación de codigo de Sala -/ CustomerID + "C" + ToyID /-
            String room = userInfoDataConnect.getCustomerId() + "C" + userInfoDataConnect.getToyId();
            //Ingresa al room
            client.joinRoom(room);

            //Retornar mensajes en el caso de que haya  TEST: cId: 99 / tId: 374
            //Parseo a int
            int cId = Integer.parseInt(userInfoDataConnect.getCustomerId());
            int toyId = Integer.parseInt(userInfoDataConnect.getToyId());

            //Where
            Map<String, Object> keyMap = new HashMap<>();
                keyMap.put(ChatLogDao.ATTR_CUSTOMER_ID, cId );
                keyMap.put(ChatLogDao.ATTR_TOY_ID, toyId );


            //Columnas a consultar
            List<String> attrList = Arrays.asList(
                    ChatLogDao.ATTR_CUSTOMER_ID,
                    ChatLogDao.ATTR_OWNER_ID,
                    ChatLogDao.ATTR_TOY_ID,
                    ChatLogDao.ATTR_MSG,
                    ChatLogDao.ATTR_INSERTED_DATE,
                    ChatLogDao.ATTR_CUSTOMER_NAME,
                    ChatLogDao.ATTR_CUSTOMER_AVATAR,
                    ChatLogDao.ATTR_PRICE,
                    ChatLogDao.ATTR_TOY_NAME,
                    ChatLogDao.ATTR_SELLER_NAME,
                    ChatLogDao.ATTR_SELLER_AVATAR
            );

            try {
                //Recibo los mensajes
                EntityResult messages = chatLogService.chatLogQuery(keyMap, attrList);

                if( messages.isEmpty() ) {
                    System.out.println("---------- Messages Empty en onCreateRoom ----------");

                    client.sendEvent("messageCount", messages.calculateRecordNumber() );
                    return;
                }
                if (messages.isWrong()) {
                    System.out.println("---------- Messages Error en onCreateRoom ----------");
                    return;
                }

                client.sendEvent("messageCount", messages.calculateRecordNumber() );

                List<SendMessage> result = new ArrayList<>();

                for (int i = 0; i < messages.calculateRecordNumber(); i++) {
                    result.add( convertToMessage( messages.getRecordValues(i) ) );
                }

                //Bucle de los resultados e ir agregandolos al chat

                result.forEach(( message ) -> {
                    client.sendEvent("receiveMessage", message);
                    //socketServer.getRoomOperations( room ).sendEvent("receiveMessage", message);
                });
            } catch (Exception ex) {
                System.out.println("Excepción: " + ex.getMessage() );
            }

        }
    };

    public DataListener<UserInfoDataConnect> leaveRoom = new DataListener<UserInfoDataConnect>() {
        @Override
        public void onData(SocketIOClient client, UserInfoDataConnect userInfoDataConnect, AckRequest ackRequest) throws Exception {
            try {
                System.out.println("LEAVE ROOM");
                //Generación de codigo de Sala -/ CustomerID + "C" + ToyID /-
                String room = userInfoDataConnect.getCustomerId() + "C" + userInfoDataConnect.getToyId();
                client.leaveRoom(room);
            }catch ( Exception ex ) {

                System.out.println("ERROR LEAVEROOM: " + ex.getMessage() );
            }
        }
    };

    private SendMessage convertToMessage(Map recordValues ) {


        SendMessage msg = new SendMessage();
         msg.setCustomerId( recordValues.get( ChatLogDao.ATTR_CUSTOMER_ID ).toString() );
         msg.setOwnerId( recordValues.get( ChatLogDao.ATTR_OWNER_ID ).toString() );
         msg.setToyId( recordValues.get( ChatLogDao.ATTR_TOY_ID).toString() );
         msg.setMsg( recordValues.get( ChatLogDao.ATTR_MSG).toString() );
         msg.setInsertedDate( recordValues.get( ChatLogDao.ATTR_INSERTED_DATE).toString() );
         msg.setCustomerName( recordValues.get( ChatLogDao.ATTR_CUSTOMER_NAME).toString() );
         msg.setCustomerAvatar(
        (recordValues.get( ChatLogDao.ATTR_CUSTOMER_AVATAR) != null ) ?
                recordValues.get( ChatLogDao.ATTR_CUSTOMER_AVATAR).toString()
                : ""
         );
         msg.setPrice( recordValues.get( ChatLogDao.ATTR_PRICE).toString() );
         msg.setToyName( recordValues.get( ChatLogDao.ATTR_TOY_NAME).toString() );
         msg.setSellerName( recordValues.get( ChatLogDao.ATTR_SELLER_NAME).toString() );
         msg.setSellerAvatar(
                 (recordValues.get( ChatLogDao.ATTR_SELLER_AVATAR) != null ) ?
                         recordValues.get( ChatLogDao.ATTR_SELLER_AVATAR).toString()
                         : ""
         );
        return  msg;
    };


    private SendMessage createMessageResponse(RecieveMessage recieveMessage) {

        int tId = Integer.parseInt( recieveMessage.getToyId() );
        int cId = Integer.parseInt( recieveMessage.getCustomerId() );

        SendMessage sendMessage = new SendMessage();


//        private  String customerId; -----cId
//        private  String toyId; ----- tId
//        private  String message; --- msg

        /** INICIO Parametros de Consulta para el SellerData **/
            //Where
            Map<String, Object> sellerDataKeyMap = new HashMap<>();
            sellerDataKeyMap.put(ToyDao.ATTR_ID, tId );

            //Columnas a consultar
            List<String> sellerDataAttrList = Arrays.asList(
                    ToyDao.ATTR_ID,
                    ToyDao.ATTR_NAME,
                    ToyDao.ATTR_PRICE,
                    ToyDao.ATTR_USR_ID,
                    "u_seller."+UserDao.NAME,
                    "u_seller."+UserDao.PHOTO
            );
        /** FIN Parametros de Consulta para el SellerData **/

        /** INICIO Consulta para el CustomerDATA **/

            //Where
            Map<String, Object> customerDataKeyMap = new HashMap<>();
            customerDataKeyMap.put(UserDao.USR_ID, cId );

            //Columnas a consultar
            List<String> customerDataAttrList = Arrays.asList(
                    UserDao.USR_ID,
                    UserDao.NAME,
                    UserDao.PHOTO
            );

        /** FIN Parametros de Consulta para el CustomerDATA **/

        try {
            //Recibo los datos del lado del seller
            EntityResult sellerData = toyService.getToysSellerDataQuery(sellerDataKeyMap, sellerDataAttrList);

            //Recibo los datos del lado del customer
            EntityResult customerData = this.daoHelper.query( this.userDao, customerDataKeyMap, customerDataAttrList );

            //Verificar si el mensaje que se recibio es del dueño del producto.
            String ownerID =  (sellerData.get( ToyDao.ATTR_USR_ID) == recieveMessage.getCustomerId() )
                    ? sellerData.getRecordValues(0).get( ToyDao.ATTR_USR_ID).toString() : recieveMessage.getCustomerId();



            sendMessage.setCustomerId(
                    customerData.getRecordValues(0).get(UserDao.USR_ID).toString()
            );
            sendMessage.setOwnerId(
                    (Objects.equals(recieveMessage.getOwner(), "true")) ?
                            sellerData.getRecordValues(0).get( ToyDao.ATTR_USR_ID).toString()
                            : recieveMessage.getCustomerId()
            );
            sendMessage.setToyId(
                    recieveMessage.getToyId()
            );
            sendMessage.setMsg(
                    recieveMessage.getMessage()
            );
            sendMessage.setInsertedDate(
                   new Date().toString()
            );
            sendMessage.setCustomerName(
                    customerData.getRecordValues(0).get(UserDao.NAME).toString()
            );
            sendMessage.setCustomerAvatar(
                    (customerData.get( UserDao.PHOTO ) != null ) ?
                            customerData.get( UserDao.PHOTO ).toString()
                            : ""
            );
            sendMessage.setPrice(
                    sellerData.getRecordValues(0).get(ToyDao.ATTR_PRICE).toString()
            );
            sendMessage.setToyName(
                    sellerData.getRecordValues(0).get(ToyDao.ATTR_NAME).toString()
            );
            sendMessage.setSellerName(
                    sellerData.getRecordValues(0).get( UserDao.NAME ).toString()
            );
            sendMessage.setSellerAvatar(
                    (sellerData.getRecordValues(0).get( UserDao.PHOTO) != null ) ?
                            sellerData.getRecordValues(0).get( UserDao.PHOTO ).toString()
                            : ""
            );

            //Recibo los datos del lado del customer



        } catch (Exception ex) {
            System.out.println("ERROR EL CreateMessageResponse: " + ex.getMessage() );
        }


        /**
         * TODO:
         *  Del customerId sacar -> Name, Avatar
         *  Del toyID sacar ->
         **/



        //QUERY ->  Seller ( getToysSellerData )
        //QUERY ->  Customer ( User )



//        private String customerId;   ----cId
//        private String ownerId; -----cId
//        private String toyId; ----- tId   /
//        private String msg; ----- msg
//        private String insertedDate; --- Date()
//        private String customerName; ----cId
//        private String customerAvatar; ----cId
//        private String price;  -----tId   /
//        private String toyName; -----tId    /
//        private String sellerName; -----tId   /
//        private String sellerAvatar; -----tId   /

        /**
         *     private String customerName;
         *     private String sellerName;
         *     private String ownerMsg;
         *     private String message; -- Ya viene en recieveMessage
         *     private String insertedDate; -- Usar mismo DATE()
         **/



        return sendMessage;




    }



}
