var users = document.querySelector('.user_block');
var message = document.querySelector('.message');
var socket = new WebSocket("ws://192.168.0.160:5678");
var btn = document.querySelector(".join");
var user_reg = document.querySelector('.reg');
var text_area = document.querySelector('textarea');

text_area.style.visibility = 'hidden';
// Registration user
function regUser() {
user_reg.addEventListener('submit', (e) => {
    e.preventDefault();
    const userField = document.querySelector('.add_user')
    if (userField.value.trim()) {
        socket.send(JSON.stringify({action: 'reg', values: userField.value.trim()}));
        user_reg.style.visibility = 'hidden';
        text_area.style.visibility = 'visible';
    } else {
        return
    }
})
}
// Get user list
function getUsers(){
    socket.send(JSON.stringify({action: 'getuser'}))


}



regUser();



socket.onopen = function(){


    text_area.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            if(this.value.trim() === ""){
                return false;
            }

            socket.send(JSON.stringify({action: 'messages', values: this.value.trim()}));
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

        p = document.createElement("p");
        var arr = data.u_name;
        console.log(arr)
        if (users.hasChildNodes()){
                users.removeChild(users.firstChild)

        }
        else {
            arr.forEach(function(item, i, arr){
                p = document.createElement("p");
                p.innerHTML = (item.toString());
                users.appendChild(p);

            });
        }


        // p.innerHTML = (data.u_name.toString());
        // document.querySelector(".user_block").appendChild(p);
        // users.textContent = (data.u_name.toString());
        console.log(data.u_name);
        break;
        case 'message':
        p = document.createElement("p");
        p.innerHTML = data.user.toString() + ': ' + data.value.toString();
        document.querySelector(".message").appendChild(p);
        message.scrollTop += 100;
        console.log(data);

        break;
        default:
        console.error('unsuported data', data);
    }
};
