var users = document.querySelector('.user_block');
var message = document.querySelector('.message');
var socket = new WebSocket("ws://192.168.0.160:5678");
var btn = document.querySelector(".join");
var user_reg = document.querySelector('.reg');
var text_area = document.querySelector('textarea')

text_area.style.visibility = 'hidden';
// document.getElementById('join').onclick = function() {
//     user_reg.style.visibility = 'hidden';
// };
// function hideregonClick() {
//     user_reg.style.visibility = 'hidden';
// };

user_reg.addEventListener('submit', (e) => {
    e.preventDefault();
    const userField = document.querySelector('.add_user')
    if (userField.value.trim()) {
        // socket.send(userField.value.trim());
        var username = userField.value.trim();
        socket.send(JSON.stringify({action: 'reg', values: username}));
        user_reg.style.visibility = 'hidden';
        text_area.style.visibility = 'visible';
    } else {
        return
    }
})


socket.onopen = function(){

    // document.querySelector('.add_user')
    // socket.send(this.value.trim());

    text_area.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            if(this.value.trim() === ""){
                return false;
            }
            var mes = this.value.trim();
            console.log(mes)
            socket.send(JSON.stringify({action: 'messages', values: mes}));
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

// btn.addEventListener('click',hideregonClick);
