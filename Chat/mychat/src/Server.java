import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.*;

public class Server implements HttpHandler {
    private List<Message> history = new ArrayList<Message>();
    private MessageExchange messageExchange = new MessageExchange();

    public static void main(String[] args) {
        if (args.length != 1)
            System.out.println("Usage: java Server port");
        else {
            try {
                System.out.println("Server is starting...");
                Integer port = Integer.parseInt(args[0]);
                HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
                System.out.println("Server started.");
                String serverHost = InetAddress.getLocalHost().getHostAddress();
                //System.out.println("Get list of messages: GET http://" + serverHost + ":" + port + "/chat?token={token}");
                //System.out.println("Send message: POST http://" + serverHost + ":" + port + "/chat provide body json in format {\"message\" : \"{message}\"} ");

                server.createContext("/chat", new Server());
                server.setExecutor(null);
                server.start();
            }
            catch (IOException e) {
                System.out.println("Error creating http server: " + e);
            }
        }
    }

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        String response = "";

        if ("GET".equals(httpExchange.getRequestMethod())) {
            response = doGet(httpExchange);
        }
        else if ("POST".equals(httpExchange.getRequestMethod())) {
            doPost(httpExchange);
        }
        else if("PUT".equals(httpExchange.getRequestMethod())){
            doPut(httpExchange);
        }
        else if("DELETE".equals(httpExchange.getRequestMethod())){
            doDelete(httpExchange);
        }
        else if("OPTIONS".equals(httpExchange.getRequestMethod()))
            response = "";
        else {
            response = "Unsupported http method: " + httpExchange.getRequestMethod();
        }

        sendResponse(httpExchange, response);
    }

    private String doGet(HttpExchange httpExchange) {
        String query = httpExchange.getRequestURI().getQuery();
        if (query != null) {
            Map<String, String> map = queryToMap(query);
            String token = map.get("token");
            if (token != null && !"".equals(token)) {
                int index = messageExchange.getIndex(token);
                return messageExchange.getServerResponse(history.subList(index, history.size()));
            }
            else {
                return "Token query parameter is absent in url: " + query;
            }
        }
        return  "Absent query in url";
    }

    private void doPost(HttpExchange httpExchange) {
        try {
            Message message = messageExchange.getClientMessage(httpExchange.getRequestBody());
            System.out.println("Get Message from " + message);
            message.setID(history.size());
            history.add(message);
        }
        catch (ParseException e) {
            System.err.println("Invalid user message: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }

    private void doPut(HttpExchange httpExchange){
        try {
            Message newMessage = messageExchange.getClientMessage(httpExchange.getRequestBody());
            if(newMessage.getID() > -1 && newMessage.getID() < history.size()){
                Message prevMessage = history.get(newMessage.getID());
                int status = prevMessage.getStatus();
                String prevMessageText = prevMessage.getMessageText();
                if(status != 2){
                    prevMessage.editMessage(newMessage.getMessageText());
                    System.out.println("Message " + "\"" + prevMessageText + "\" of " + prevMessage.getUsername() +
                            " was edited to \"" + prevMessage.getMessageText() + "\"");
                }
            }
        }
        catch (ParseException e) {
            System.err.println("Invalid user message: " + httpExchange.getRequestBody() + " " + e.getMessage());
        }
    }

    private void doDelete(HttpExchange httpExchange){
        String query = httpExchange.getRequestURI().getQuery();
        if(query != null){
            StringTokenizer sttk = new StringTokenizer(query,"()");
            //int messageIndex = Integer.parseInt(sttk.nextToken());
            Map<String, String> map = queryToMap(query);
            int messageIndex = Integer.parseInt(map.get("ID"));
            if(messageIndex > -1 && messageIndex < history.size()){
                Message temp = history.get(messageIndex);
                if(temp.getStatus() != 2){
                    String tempText = temp.getMessageText();
                    temp.deleteMessage();
                    System.out.println("Message " + "\"" + tempText + "\" of " + temp.getUsername() + " was deleted.");
                }
            }
        }
    }

    private void sendResponse(HttpExchange httpExchange, String response) {
        try {
            byte[] bytes = response.getBytes();
            Headers headers = httpExchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin","*");
            if("OPTIONS".equals(httpExchange.getRequestMethod())) {
                headers.add("Access-Control-Allow-Methods","PUT, DELETE, POST, GET, OPTIONS");
            }
            httpExchange.sendResponseHeaders(200, bytes.length);

            OutputStream os = httpExchange.getResponseBody();
            os.write( bytes);
            os.flush();
            os.close();
        }
        catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Map<String, String> queryToMap(String query) {
        Map<String, String> result = new HashMap<String, String>();
        for (String param : query.split("&")) {
            String pair[] = param.split("=");
            if (pair.length > 1) {
                result.put(pair[0], pair[1]);
            }
            else {
                result.put(pair[0], "");
            }
        }
        return result;
    }
}
