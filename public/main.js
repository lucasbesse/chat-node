const socket = io()
let user_name = ''
let users_list = []

let login_page = document.getElementById('loginPage')
let chat_page = document.getElementById('chatPage')

let login_input = document.getElementById('loginInput')
let chat_input = document.getElementById('chatInput')

login_input.addEventListener('keyup', (e)=>{
    if(e.keyCode === 13){
        login()
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

socket.on('user-ok', (response)=>{
    users_list = response
    login_page.style.display = 'none'
    chat_page.style.display = 'flex'
    loadUsersList()
})

function loadUsersList(){
    let connected_container = document.querySelector('.connected')
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