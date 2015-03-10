var nickname = "";
var chosenMessage = null;
var toEdit = false;

function run() {
    var messageContainer = document.getElementById('input-btn');
    messageContainer.addEventListener('click', onAddButtonClick);
    
    var nickInput = document.getElementById("nicknameInput");
    nickInput.addEventListener('click', onNickButtonClick);
    
    var editButton = document.getElementById("editButton");
    editButton.addEventListener('click', onEditButtonClick);
    
    var deleteButton = document.getElementById("deleteButton");
    deleteButton.addEventListener('click', onDeleteButtonClick);
}

function onAddButtonClick() {
    if(toEdit == true){
        var messageText = document.getElementById('message');
        chosenMessage.childNodes[1].innerText = messageText.value;
        messageText.value = " ";
        chosenMessage.classList.remove('clickedMessage');
        chosenMessage = null;
        toEdit = false;
        return;
    }
    else{
        var messageText = document.getElementById('message');
        addToTable(messageText.value);
        messageText.value = " ";
    }
}

function onNickButtonClick(){
    var nickText = document.getElementById('nickname');
    nickname = nickText.value;
}

function onEditButtonClick(){
    if(chosenMessage == null)
        return;
    var editedText = chosenMessage.childNodes[1].innerText;
    var messageBox = document.getElementById('message');
    var inputButton = document.getElementById('input-btn');
    
    toEdit = true;
    messageBox.value = editedText;
}
                                 
function onDeleteButtonClick(){
    if(chosenMessage != null){
        chosenMessage.parentNode.removeChild(chosenMessage);
        chosenMessage = null;
    }
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

function addToTable(value) {
    if (!value) {
        return;
    }
    while (nickname.length === 0) {
        nickname = prompt("Enter nickname", '');
        var nickText = document.getElementById('nickname');
        nickText.value = nickname;
    }
    var item = createMessage(value);
    item.addEventListener('click', onMessageClick);
    var items = document.getElementById('messageTable');
    items.appendChild(item);
}

function createMessage(text) {
    var trItem = document.createElement('tr');
    var nickItem = document.createElement('td');
    var messageItem = document.createElement('td');
    
    nickItem.setAttribute('class', 'col-name');
    nickItem.appendChild(document.createTextNode(nickname));
    
    messageItem.setAttribute('class','col-text');
    messageItem.appendChild(document.createTextNode(text));
    
    trItem.appendChild(nickItem);
    trItem.appendChild(messageItem);
    return trItem;
}