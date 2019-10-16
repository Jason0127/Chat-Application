import axios from 'axios'

export async function auth(){
    const auth = await axios.get('/api/auth')
    return auth.data
}

export async function getContactAndMessageReq(skip){

    const contact = await Promise.resolve(axios.get(`/api/getContact?skip${skip}`))

    return{
        payload: contact.data
    }

}

export async function getChatMessages(cid, skip = 0){
    const messages  = await axios.get(`/api/getMessage?convo_id=${cid}&skip=${skip}`)

    return {
        payload: messages.data
    }
}

export async function sendReply({converId, message, senderId, index}){
    console.log('a')
    const reply = await axios.post(`/api/reply?conver_id=${converId}&sender_id=${senderId}`, {
        message: message, index: index
    })

    return {
        payload: reply.data
    }
}

export async function login(data){
    const user = await axios.post('/api/login', {username: data.userName, password: data.password})

    return{
        payload: user.data
    }
}