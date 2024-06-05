package com.campusdual.cd2024bfs3g1.model.core.service;

import com.campusdual.cd2024bfs3g1.model.core.chat.data.SendMessage;
import com.campusdual.cd2024bfs3g1.model.core.chat.data.RecieveMessage;
import com.campusdual.cd2024bfs3g1.model.core.chat.data.UserInfoDataConnect;
import com.campusdual.cd2024bfs3g1.model.core.dao.ChatLogDao;
import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.ontimize.jee.common.dto.EntityResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class SocketIOService {
    @Autowired
    private ChatLogService chatLogService;

    @Autowired
    private SocketIOServer socketServer;


    SocketIOService(SocketIOServer socketServer){
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
            System.out.println("Client DATA: " + client.getNamespace().getName() );
            System.out.println("Client DATA: " + client.getHandshakeData() );
            System.out.println("Client DATA: " + client.getNamespace().getName() );

            //client.joinRoom("test");

            System.out.println("CLIENT GET ALL ROOMS: " + client.getAllRooms() );
            System.out.println("Perform operation on user connect in controller");
        }
    };

    public DisconnectListener onUserDisconnectWithSocket = new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {

            System.out.println("USUARIO : " + client.getSessionId() + " Desconectado. ");


            System.out.println("Perform operation on user disconnect in controller");
        }
    };

    public DataListener<RecieveMessage> onSendMessage = new DataListener<>() {

        @Override
        public void onData(SocketIOClient client, RecieveMessage recieveMessage, AckRequest acknowledge) throws Exception {

            //Generación de codigo de Sala -/ CustomerID + "C" + ToyID /-
            String room = recieveMessage.getCustomerId() + "C" + recieveMessage.getToyId();


            //Emitir formateado con SendMessage
            SendMessage sendMessage =  createMessageResponse( recieveMessage );





            //Emitimos
            socketServer.getRoomOperations( room ).sendEvent("receiveMessage", sendMessage);

            /**
            *   Esto manda un mensaje a un sender especifico
            **/

            //socketServer.getBroadcastOperations().sendEvent("test", client, message.getMessage() );

            //socketServer.getRoomOperations( room ).sendEvent("receiveMessage", message);

            // Logging the message
//            System.out.println("Mensaje De: " + message.getFromUser());
//            System.out.println("Enviado A: " + message.getToUser());
//            System.out.println("Mensaje : " + message.getMessage());

            /**
             * After sending message to target user we can send acknowledge to sender
             */
            acknowledge.sendAckData("Message send to target user successfully");
        }
    };



    public DataListener<UserInfoDataConnect> onCreateRoom = new DataListener<>() {
        @Override
        public void onData(SocketIOClient client, UserInfoDataConnect userInfoDataConnect, AckRequest ackRequest) throws Exception {

            //Generación de codigo de Sala -/ CustomerID + "C" + ToyID /-
            String room = userInfoDataConnect.getCustomerId() + "C" + userInfoDataConnect.getToyId();
            //Ingresa al room
            client.joinRoom(room);

            //Retornar mensajes en el caso de que haya
            //Parseo a int
            int cId = Integer.parseInt(userInfoDataConnect.getCustomerId());
            int toyId = Integer.parseInt(userInfoDataConnect.getToyId());

            //Where
            Map<String, Object> keyMap = new HashMap<>();
                keyMap.put(ChatLogDao.ATTR_CUSTOMER_ID, 99 );
                keyMap.put(ChatLogDao.ATTR_TOY_ID, 374 );


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

                    socketServer.getRoomOperations( room ).sendEvent("messageCount", messages.calculateRecordNumber() );
                    return;
                }
                if (messages.isWrong()) {
                    System.out.println("---------- Messages Error en onCreateRoom ----------");
                    return;
                }

                socketServer.getRoomOperations( room ).sendEvent("messageCount", messages.calculateRecordNumber() );

                List<SendMessage> result = new ArrayList<>();

                for (int i = 0; i < messages.calculateRecordNumber(); i++) {
                    result.add( convertToMessage( messages.getRecordValues(i) ) );
                }

                //Bucle de los resultados e ir agregandolos al chat

                result.forEach(( message ) -> {
                    socketServer.getRoomOperations( room ).sendEvent("receiveMessage", message);
                });
            } catch (Exception ex) {
                System.out.println("Excepción: " + ex.getMessage() );
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
         msg.setCustomerAvatar( recordValues.get( ChatLogDao.ATTR_CUSTOMER_AVATAR).toString() );
         msg.setPrice( recordValues.get( ChatLogDao.ATTR_PRICE).toString() );
         msg.setToyName( recordValues.get( ChatLogDao.ATTR_TOY_NAME).toString() );
         msg.setSellerName( recordValues.get( ChatLogDao.ATTR_SELLER_NAME).toString() );
         msg.setSellerAvatar( recordValues.get( ChatLogDao.ATTR_SELLER_AVATAR).toString() );

//        msg.setCustomerName( (String) recordValues.get( ChatLogDao.ATTR_CUSTOMER_NAME ) );
//        msg.setSellerName( (String) recordValues.get( ChatLogDao.ATTR_SELLER_NAME ) );
//        msg.setOwnerId(  recordValues.get( ChatLogDao.ATTR_OWNER_ID ).toString() );
//        msg.setMsg( (String) recordValues.get( ChatLogDao.ATTR_MSG) );
//        msg.setInsertedDate(  recordValues.get( ChatLogDao.ATTR_INSERTED_DATE ).toString() );

        return  msg;
    }


    private SendMessage createMessageResponse(RecieveMessage recieveMessage) {

        SendMessage sendMessage = new SendMessage();

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
