var nickname = "";
var isEdit = false;

function run() {
    var messageContainer = document.getElementById('workspace');
    messageContainer.addEventListener('click', delegateEvent);
    
    var nickInput = document.getElementById("nicknameInput");
    nickInput.addEventListener('click', delegateEvent);
    
    var editButton = document.getElementById("editButton")
    editButton.addEventListener('click',delegateEvent);
    
    var deleteButton = document.getElementById("deleteButton")
    deleteButton.addEventListener('click',delegateEvent);
    
    highlightTableRows("idTable","hoverRow","clickedRow")
}

function delegateEvent(evtObj) {
	if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-add')){
		onAddButtonClick(evtObj);
	}
    if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-nick')){
		onNickButtonClick(evtObj);
	}
    if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-edit')){
		onEditButtonClick(evtObj);
	}
    if(evtObj.type === 'click' && evtObj.target.classList.contains('btn-del')){
		onDeleteButtonClick(evtObj);
	}
}

function onAddButtonClick() {
    var messageText = document.getElementById('message');
    
    addToTable(messageText.value);
    messageText.value = " ";
}

function onNickButtonClick(){
    var nickText = document.getElementById('nickname');
    
    nickname = nickText.value;
}

function onEditButtonClick(){
    var editedMessage = document.getElementsByClassName('clickedRow')[0];
    
}

function onDeleteButtonClick(){
    var table = document.getElementById('messageTable');
    
    var rows = table.getElementsByTagName('TR');
    var i = rows.length;
    while(i--){
        var line = rows[i];
        if(line.getAttribute('clickedRow')){
            var parent = line.parentNode;
            parent.removeChild(line);
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


function highlightTableRows(tableId, hoverClass, clickClass, multiple){
    var table = document.getElementById(tableId);
    if (typeof multiple == 'undefined') 
        multiple = true;
    if (hoverClass) {
        var hoverClassReg = new RegExp("\\b"+hoverClass+"\\b");
        table.onmouseover = table.onmouseout = function(e) {
            if (!e) 
                e = window.event;
            var elem = e.target || e.srcElement;
            while (!elem.tagName || !elem.tagName.match(/td|th|table/i))
                elem = elem.parentNode;

            if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY') {
                var row = elem.parentNode;
                if (!row.getAttribute('clickedRow'))
                    row.className = e.type == "mouseover" ? row.className + " " + hoverClass : row.className.replace(hoverClassReg," ");
            }
        };
    }
    
    if (clickClass) 
        table.onclick = function(e) {
            if (!e)
                e = window.event;
            var elem = e.target || e.srcElement;
            while (!elem.tagName || !elem.tagName.match(/td|th|table/i))
                elem = elem.parentNode;

            if (elem.parentNode.tagName == 'TR' && elem.parentNode.parentNode.tagName == 'TBODY') {
                var clickClassReg = new RegExp("\\b"+clickClass+"\\b");
                var row = elem.parentNode;

                if (row.getAttribute('clickedRow')) {
                    row.removeAttribute('clickedRow');
                    row.className = row.className.replace(clickClassReg, "");
                    row.className += " " + hoverClass;
                }
                else {
                    if (hoverClass)
                        row.className = row.className.replace(hoverClassReg, "");
                    row.className += " " + clickClass;
                    row.setAttribute('clickedRow', true);

                    if (!multiple) {
                        var lastRowI = table.getAttribute("last_Clicked_Row");
                        if (lastRowI !== null && lastRowI !== '' && row.sectionRowIndex != lastRowI) {
                            var lastRow = table.tBodies[0].rows[lastRowI];
                            lastRow.className = lastRow.className.replace(clickClassReg, "");
                            lastRow.removeAttribute('clickedRow');
                        }
                    }
                    table.setAttribute("last_Clicked_Row", row.sectionRowIndex);
                }
            }
        };
}