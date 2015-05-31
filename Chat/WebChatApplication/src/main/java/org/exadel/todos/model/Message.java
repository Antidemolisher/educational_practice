package org.exadel.todos.model;

import org.json.simple.JSONAware;
import org.json.simple.JSONObject;

public class Message implements JSONAware {
        private String username;
        private String messageText;
        private String ID;
        private int status;

        public Message() {
            username = "User1";
            messageText = "";
            ID = "0";
        }

        public Message(String id,String name, String text) {
            username = name;
            messageText = text;
            ID = id;
        }

    @Override
    public String toString(){
        return username + " : " + messageText;
    }

    public boolean equals(Object o){
        return (((Message)o).getID().equals(ID));
    }

    public void setID(String newID){
        ID = newID;
    }
    public String getID(){
        return ID;
    }
    public String getUsername(){
        return username;
    }
    public String getMessageText(){
        return messageText;
    }

    @Override
    public String toJSONString() {
        JSONObject obj = new JSONObject();
        obj.put("id",ID);
        obj.put("messageText",messageText);
        obj.put("username",username);
        return obj.toString();
    }
}
