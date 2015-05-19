var nickname = "";
var chosenMessage = null;
var toEdit = false;

var messageHistory = [];

var appState = {
    mainUrl: 'http://localhost:999/chat',
    token: 'TE11EN'
};

function run() {
    var messageContainer = document.getElementById('input-btn');
    messageContainer.addEventListener('click', onAddButtonClick);
    
    var nickInput = document.getElementById("nicknameInput");
    nickInput.addEventListener('click', onNickButtonClick);
    
    var editButton = document.getElementById("editButton");
    editButton.addEventListener('click', onEditButtonClick);
    
    var deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener('click', onDeleteButtonClick);
    
    nickname = getNickFromStorage() || "";
    var nickText = document.getElementById('nickname');
    nickText.value = nickname;
    
    var allMessages = getMessageHistory();
    if(allMessages != null)
        rebuildMessageHistory(allMessages);
}

var uniqueId = function() {
	var date = Date.now();
	var random = Math.random() * Math.random();
	return Math.floor(date * random).toString();
};

var theMessage = function(nick, text, stat) {
	return {
		username: nick,
		messageText: text,
		id: uniqueId(),
        status: stat
	};
};

function rebuildMessageHistory(allMessages){
    for(var i = 0; i < allMessages.length; i++)
        addToTable(allMessages[i]);
}

function onAddButtonClick() {
    if(toEdit == true){
        var chosenMessageID = chosenMessage.getAttribute("message-id");
        var messageText = document.getElementById('message');
        for(var i = 0; i < messageHistory.length; i++){
            if(messageHistory[i].id == chosenMessageID){
                messageHistory[i].messageText = messageText.value;
                messageHistory[i].status = 1;
                break;
            }
        }
        chosenMessage.childNodes[1].innerText = messageText.value;
        chosenMessage.childNodes[1].classList.add("editedMessage");
        messageText.value = "";
        chosenMessage.classList.remove('clickedMessage');
        chosenMessage = null;
        toEdit = false;
        storeMessageHistory(messageHistory);
        return;
    }
    else{
        var messageText = document.getElementById('message');
        while (nickname.length === 0) {
            nickname = prompt("Enter nickname", '');
            storeNickname();
            var nickText = document.getElementById('nickname');
            nickText.value = nickname;
        }
        if(messageText.value == "")
            return;
        var message = theMessage(nickname,messageText.value,0);
        addToTable(message);
        messageText.value = " ";
    }
}

function onNickButtonClick(){
    var nickText = document.getElementById('nickname');
    nickname = nickText.value;
    storeNickname();
}

function onEditButtonClick(){
    if(chosenMessage == null)
        return;
    if(chosenMessage.childNodes[0].innerText != nickname)
    {
        chosenMessage.classList.remove('clickedMessage');
        chosenMessage = null;
        return;
    }
    
    var chosenMessageID = chosenMessage.getAttribute("message-id");
    var messageText = document.getElementById('message');
    for(var i = 0; i < messageHistory.length; i++){
        if(messageHistory[i].id == chosenMessageID){
            if(messageHistory[i].status == 2){
                chosenMessage.classList.remove('clickedMessage');
                chosenMessage = null;
                toEdit = false;
                messageText.value = "";
                return;
            }
        }
    }
    
    var editedText = chosenMessage.childNodes[1].innerText;
    var messageBox = document.getElementById('message');
    var inputButton = document.getElementById('input-btn');
    
    toEdit = true;
    messageBox.value = editedText;
}
                                 
function onDeleteButtonClick(){
    if(chosenMessage == null)
        return;
    if(chosenMessage.childNodes[0].innerText != nickname)
    {
        chosenMessage.classList.remove('clickedMessage');
        chosenMessage = null;
        return;
    }
    
    chosenMessage.childNodes[1].innerText = "Message was deleted.";
    chosenMessage.childNodes[1].classList.add("deletedMessage");
    var chosenMessageID = chosenMessage.getAttribute("message-id");
    for(var i = 0; i < messageHistory.length; i++){
        if(messageHistory[i].id == chosenMessageID){
            messageHistory[i].messageText = "Message was deleted.";
            messageHistory[i].status = 2;
            break;
        }
    }
    chosenMessage.classList.remove('clickedMessage');
    chosenMessage = null;
    storeMessageHistory(messageHistory);
}

function onMessageClick(e){
    if(chosenMessage == null){
        chosenMessage = this;
        chosenMessage.classList.add('clickedMessage');
        return;
    }
    else{
        if(chosenMessage == this){
            this.classList.remove('clickedMessage');
            chosenMessage = null;
            return;
        }
        else{
            chosenMessage.classList.remove('clickedMessage');
            chosenMessage = this;
            chosenMessage.classList.add('clickedMessage');
        }
    }
}

function addToTable(message) {
    messageHistory.push(message);
    var item = createMessage(message);
    item.addEventListener('click', onMessageClick);
    var items = document.getElementById('messageTable');
    items.appendChild(item);
    storeMessageHistory(messageHistory);
}

function createMessage(message) {
    var trItem = document.createElement('tr');
    var nickItem = document.createElement('td');
    var messageItem = document.createElement('td');
    
    nickItem.setAttribute('class', 'col-name');
    nickItem.appendChild(document.createTextNode(message.username));
    
    messageItem.setAttribute('class','col-text');
    messageItem.appendChild(document.createTextNode(message.messageText));
    if(message.status == 1)
        messageItem.classList.add("editedMessage");
    if(message.status == 2)
        messageItem.classList.add("deletedMessage");
    
    trItem.setAttribute("message-id", message.id);
    trItem.appendChild(nickItem);
    trItem.appendChild(messageItem);
    return trItem;
}

function storeMessageHistory(history){
    if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
    localStorage.setItem("messageHistory", JSON.stringify(history));
}
    
function getMessageHistory(){
    var url = appState.mainUrl + '?token=' + appState.token;
    get(url, function(responseText){
        console.assert(responseText != null);
        var response = JSON.parse(responseText).message;
        rebuildMessageHistory(response);
        
        continueWith && continueWith();
    });
}

function restoreMessages(continueWith) {
    var url = appState.mainUrl + '?token=' + appState.token;

    get(url, function (responseText) {
        console.assert(responseText != null);
        delegateEventServer();
        var response = JSON.parse(responseText).messages;
        createAllMessages(response);

        continueWith && continueWith();
    });
}

function storeNickname(){
    if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
    localStorage.setItem("nickname", nickname);
}

function getNickFromStorage(){
    if(typeof(Storage) == "undefined") {
		alert('localStorage is not accessible');
		return;
	}
    var word = localStorage.getItem("nickname");
    return word;
}

function get(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}

function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError || defaultErrorHandler;
    xhr.open(method || 'GET', url, true);

    xhr.onload = function () {
        if (xhr.readyState !== 4)
            return;

        if (xhr.status != 200) {
            continueWithError('Error on the server side, response ' + xhr.status);
            return;
        }

        if (isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            return;
        }

        continueWith(xhr.responseText);
    };

    xhr.ontimeout = function () {
        continueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
        var errMsg = 'Server connection error !\n' +
    	'\n' +
    	'Check if \n' +
    	'- server is active\n' +
    	'- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
}