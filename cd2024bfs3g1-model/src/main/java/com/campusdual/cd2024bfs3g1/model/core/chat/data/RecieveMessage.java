package com.campusdual.cd2024bfs3g1.model.core.chat.data;

public class RecieveMessage {

    private  String customerId;
    private  String toyId;
    private  String message;

    public RecieveMessage() {
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getToyId() {
        return toyId;
    }

    public void setToyId(String toyId) {
        this.toyId = toyId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
