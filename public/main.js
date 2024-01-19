const socket = io()
let user_name = ''
let users_list = []

let login_page = document.getElementById('loginPage')
let chat_page = document.getElementById('chatPage')

let login_input = document.getElementById('loginInput')
let chat_input = document.getElementById('chatInput')
let msg_container = document.querySelector('.msg-container')
let joined_list = []

login_input.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        login()
    }
})

chat_input.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        sendMessage()
    }
})

function login(){
    let name = login_input.value.trim()
    if(name.length == 0){
        return
    }
    user_name = name
    document.title = `Chat (${user_name})`
    
    socket.emit('entry-request', user_name)
}

function loadUsersList(){
    let connected_container = document.querySelector('.connected')
    connected_container.innerHTML = ''
    let online_span = document.createElement('span')
    online_span.classList.add('online')
    online_span.innerText = 'Online'
    connected_container.append(online_span)
    for(let user of users_list){
        let span = document.createElement('span')
        span.innerHTML = user
        span.classList.add('name')

        let div = document.createElement('div')
        div.classList.add('connected-names')

        div.append(span)
        connected_container.append(div)
    }
}

function createUserStatusSpan(name, action){
    if(name){
        let joined_span = document.createElement('div')
        joined_span.classList.add('entered')
        joined_span.innerText = action == 'enter' ? `${name} entrou na sala` : `${name} saiu da sala`
        msg_container.append(joined_span)
    }
}

function sendMessage(){
    let input = document.getElementById('chatInput').value
    socket.emit('send-msg', input)
}

function createMessage(msg){
    let class_name = (msg.name == user_name) ? 'name' : 'name-active'
    let message = document.createElement('div')
    message.classList.add('msg')
    let name = document.createElement('span')
    let message_content = document.createElement('div')
    message_content.classList.add('msg-content')
    name.classList.add(class_name)
    name.innerText = msg.name
    message_content.innerText = msg.msg
    message.append(name)
    message.append(message_content)
    msg_container.append(message)
}

socket.on('user-ok', (response)=>{
    users_list = response
    login_page.style.display = 'none'
    chat_page.style.display = 'flex'
    createUserStatusSpan('Você', 'enter')
    loadUsersList()
})

socket.on('list-update', (data)=>{
    users_list = data.updated_list
    loadUsersList()
    createUserStatusSpan(data.joined_user, 'enter')
})

socket.on('disconnection', (data)=>{
    users_list = data.list
    loadUsersList()
    createUserStatusSpan(data.disconnected, 'left')
})

socket.on('get-message', (msg)=>{
    createMessage(msg)
})

socket.on('get-message-user', (msg)=>{
    createMessage(msg)
})

