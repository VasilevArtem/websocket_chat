var users = document.querySelector('.user_block');
var message = document.querySelector('.message');
var socket = new WebSocket("ws://192.168.0.160:5678");
var btn = document.querySelector(".join");
var user_reg = document.querySelector('.reg');
// document.getElementById('join').onclick = function() {
//     user_reg.style.visibility = 'hidden';
// };
function hideregonClick() {
    user_reg.style.visibility = 'hidden';
};



socket.onopen = function(){

    document.querySelector("textarea").addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            if(this.value.trim() === ""){
                return false;
            }
            socket.send(this.value.trim());
            this.value = "";
        }

    });

};

socket.onerror = function(){
    console.log('Ошибка при подключении');
};
var p = "";
socket.onmessage = function() {

    data = JSON.parse(event.data);

    switch (data.type) {
        case 'users':
        users.textContent = (data.count.toString() + " user" +
        (data.count ==1 ? "" : 's'));
        console.log(data);
        break;
        case 'message':
        p = document.createElement("p");
        p.innerHTML = data.value.toString();
        document.querySelector(".message").appendChild(p);

        break;
        default:
        console.error('unsuported data', data);
    }
};

btn.addEventListener('click',hideregonClick);
