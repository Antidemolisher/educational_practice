import org.json.simple.JSONAware;
import org.json.simple.JSONObject;

public class Message implements JSONAware {
    private String username;
    private String messageText;
    private int ID;
    private int status;

    Message() {
        username = "User1";
        messageText = "";
        ID = (int)(Math.random()*100000);
        status = 0;
    }

    Message(String name, String text){
        username = name;
        messageText = text;
        ID = (int)(Math.random()*100000);
        status = 0;
    }

    @Override
    public String toJSONString(){
        JSONObject obj = new JSONObject();
        obj.put("username", username);
        obj.put("messageText", messageText);
        obj.put("ID", ID);
        obj.put("status", status);
        return obj.toString();
    }

    @Override
    public String toString(){
        return username + " : " + messageText;
    }

    @Override
    public boolean equals(Object o){
        return (((Message)o).getID() == ID);
    }

    public void setID(int newID){
        ID = newID;
    }
    public int getID(){
        return ID;
    }
    public String getUsername(){
        return username;
    }
    public String getMessageText(){
        return messageText;
    }
    public int getStatus(){return status;}

    public static Message parse(JSONObject o){
        Message temp = new Message();
        temp.username = (String)o.get("username");
        temp.messageText = (String)o.get("messageText");
        temp.ID = Integer.parseInt(o.get("ID").toString());
        temp.status = Integer.parseInt(o.get("status").toString());
        return temp;
    }

    public void deleteMessage(){
        if(status != 2){
            status = 2;
            messageText = "Message was deleted.";
        }
    }

    public void editMessage(String newText){
        if(status != 2){
            status = 1;
            messageText = newText;
        }
    }
}
