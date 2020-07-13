const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

const $messageTemplate = document.querySelector('#message-template').innerHTML

const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offSetHeight + newMessageMargin

    const visibleHeight = $messages.offSetHeight

    const containerHeight = $messages.scrollHeight
    const scrollOffset = $messages.scrollTop
}

socket.on('message', (message)=>{
    console.log(message);
    const html = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage',(message)=>{
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, { 
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e)=>{

    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value =''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log(`Message Deliverd!`)
    })

})
// $sendLocationButton.addEventListener('click', () => {
//     if(!navigator.geolocation){
//         console.log('Gelolocation is not supported by your browser')
//     }

//     $sendLocationButton.setAttribute('disabled','disabled')
//     navigator.geolocation.getCurrentPosition((position) => {
//         console.log(position)
//         socket.emit('sendLocation', {
//             'latitude': position.coords.latitude,
//             'longitude': position.coords.longitude
//         }, ()=>{
//             $sendLocationButton.removeAttribute('disabled')
//             console.log('location shared!')
//         })
//     })
// })

socket.emit('join', {username, room}, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }

})