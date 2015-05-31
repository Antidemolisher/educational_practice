package org.exadel.todos.util;

import org.exadel.todos.model.Message;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public final class TaskUtil {
	public static final String TOKEN = "token";
	public static final String MESSAGES = "messages";
	private static final String TN = "TN";
	private static final String EN = "EN";
	private static final String ID = "id";
	private static final String TEXT = "messageText";
	private static final String USERNAME = "username";

	private TaskUtil() {
	}

	public static String getToken(int index) {
        return String.valueOf(index);
	}

	public static int getIndex(String token) {
		return Integer.valueOf(token);
	}

	public static JSONObject stringToJson(String data) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONObject) parser.parse(data.trim());
	}

	public static Message jsonToMessage(JSONObject json) {
		Object id = json.get(ID);
		Object text = json.get(TEXT);
		Object username = json.get(USERNAME);

		if (id != null && text != null && username != null) {
			return new Message((String) id, (String) username, (String) text);
		}
		return null;
	}
}
