const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server)
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require('moment')
const config = require('./config/config').get(process.env.NODE_ENV)


// mongoose.Promise = global.Promise;

mongoose.connect(config.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(bodyParser.json());
app.use(cookieParser());
const {User} = require('./model/user_schema');
const {Message} = require('./model/message_schema');
const {Conversation} = require('./model/conversetion_schema')
const {auth} = require('./middleware/auth');
// const

// **GET** //

// Auth

app.get('/api/auth', auth, (req, res)=>{
    res.json({
        username: req.user.username,
        name: req.user.name,
        contact: req.user.contact,
        id: req.user._id
    })
})

// logout User

app.get('/api/logout', auth, (req, res)=>{
    const data = {
        timeLogout: moment().format('MM-DD-YYYY h:mm:ss a')
    }

    // console.log(data.timeLogout)

    req.user.deleteTokenAndUpdateState(data, (err, user) =>{
        if(err) return res.status(400).send(err)
        res.json(user)
    })
})

// Get Contact And Conversation
app.get('/api/getContact', auth, (req, res) =>{
    const skip = parseInt(req.query.skip)
    User.findById(req.user._id).select('contact messagereq')
    .skip(skip)
    .populate({path: 'contact.userId', select: 'name'})
    .populate({path: 'messagereq.userId', select: 'name'})
    .exec(async(err, user) =>{
        try{
            if(err) return res.status(400).send(err)
            // Find Conversation
            const conversation = await Conversation.find({members: req.user._id}).select('_id').exec();
            const allConvesation = async function(conversation){
                return await Promise.all(conversation.map(async(convo)=>{
                    const message = await Message.findOne({conversatioId: convo._id}).limit(1).sort('-createdAt')
                    .populate({path: 'from', select: 'name'})
                    .exec()
                    return message
                }))
            }
            allConvesation(conversation).then(messages =>{
                const info = messages.map((message) =>{
                    // get Contact + lates Message
                   const contactinfo = user.contact.find((contactItem) =>{
                        if(contactItem.conversationId.toString() === message.conversatioId.toString()){
                            return {
                                name: contactItem.userId
                            }
                            
                        }
                    })
                    if(contactinfo){
                        return {
                            contact: {
                                name: contactinfo.userId.name,
                                _id: contactinfo.userId._id,
                                cid: message.conversatioId,
                                message: message.message,
                                createdAt: message.createdAt.toString(),
                                from: message.from,
                            }
                        }
                    }
                    // get Message Request + lates Message
                    const messageReqinfo = user.messagereq.find((messageReqItem)=>{
                        if(messageReqItem.conversationId.toString() === message.conversatioId.toString()){
                            return{
                                name: messageReqItem.userId
                            }
                        }
                    })
                    if(messageReqinfo){
                        return {
                            messagereq: {
                                name: messageReqinfo.userId.name,
                                _id: messageReqinfo.userId._id,
                                cid: message.conversatioId,
                                message: message.message,
                                createdAt: message.createdAt.toString(),
                                from: message.from,
                                isAccepted: messageReqinfo.accepted
                            }
                        }
                    }
                })
                res.json(info)
            })
        }catch(err){
            console.error(err)
        }
    })
})

// Get Conversation

app.get('/api/getConversation', auth, async (req, res) =>{
    try{
        const conversation = await Conversation.find({members: req.user._id}).select('_id').exec();
        const allConvesation = async function(conversation){
            const message = await Promise.all(conversation.map(async(convo, key) =>{
                return await Message.findOne({conversatioId: convo._id}).limit(1).sort('-createdAt').populate({path: 'from', select: 'name'}).exec()
            }))
            return message
        }
        allConvesation(conversation).then(message => res.json(message))
    } catch(err){
        res.status(400).send(err)
    }
})

// Get AllMessage
app.get('/api/getMessage', auth, (req, res) =>{
    const convoId = req.query.convo_id;
    const skip = parseInt(req.query.skip)
    Message.find({conversatioId: convoId}).select('message from createdAt')
    .populate({path: 'from', select: 'name'}).sort('createdAt')
    .skip(skip)
    .exec((err, messages) =>{
        if(err) return res.status(400).send(err)
        res.json(messages)
    });

})

// **POST** //

// Add User
app.post('/api/addUser', async (req, res)=>{
    
    try{
        const user = await new User(req.body)
        await user.save()
        res.send(user)
    } catch(err){
        res.status(400).send(err)
    }

})

// New Message
app.post('/api/newMessage', auth, (req, res) =>{
    const senderId = req.user._id;
    const recipientsId = req.query.id;

    const data = {
        members: [senderId, recipientsId]
    }

    const conversation = new Conversation(data)

    conversation.save((err, newConversation) =>{
        if(err) return res.status(400).send(err)

        const message = new Message({
            conversatioId: newConversation._id,
            message: req.body.message,
            from: senderId
        })

        req.user.contact = [
            ...req.user.contact,
            {userId: recipientsId, conversationId: newConversation._id}
        ]

        User.findOneAndUpdate({_id: recipientsId}, {$push: {
            messagereq: {
                userId: senderId,
                conversationId: newConversation._id
            }
        }}, {new: true}, (err, user1) =>{
            if(err) return res.status(400).send(err)
        })
        req.user.save((err, user) =>{
            if(err) return res.status(400).send(err)
            message.save((err, newMessage) =>{
                if(err) return res.status(400).send(err)
                res.json({
                    message: 'conversation Started',
                    conversatio_id: newConversation._id,
                })
            })
        })

    })

})

// Reply Message

app.post('/api/reply', (req, res) =>{
    const converId = req.query.conver_id;
    const senderId = req.query.sender_id;
    const index = req.body.index;
    const replyMessage = new Message({
        conversatioId: converId,
        message: req.body.message,
        from: senderId
    })

    replyMessage.save((err, message) =>{
        if(err) return res.status(400).send(err)
        res.json({
            success: true,
            index,
            message
        })
    })

})

// Log User in

app.post('/api/login', (req, res)=>{
    User.findOne({username: req.body.username}, (err, user)=>{
        if(err) return res.status(400).send(err)
        if(!user) return res.status(400).json({
            isAuth: false,
            message: 'Invalid email or Password'
        })
        const candidatePassword = req.body.password
        user.comaprePassword(candidatePassword, (err, isMatch)=>{
            if(err) return res.status(400).send(err)
            if(!isMatch) return res.status(400).json({
                isAuth: false,
                message: 'Invalid email or Password'
            })

            const data = {
                timeLog: moment().format('MM-DD-YYYY h:mm:ss a')
            }

            user.generateTokenAndUpdateState(data, (err, user)=>{
                if(err) return res.status(400).send(err)
                console.log(user.token)
                res.cookie('_auth_', user.token).json({
                    isAuth: true,
                    user: {
                        username: user.username,
                        name: user.name,
                        contact: user.contact,
                        id: user._id
                    }
                })
            })

        })
    })
})

// Accept Request
app.put('/api/acceptReq', auth, (req, res) =>{
    let userId = req.query.userId;
    let user = req.user.messagereq
    for(let i = 0; i < user.length; i++){
        if(user[i].userId.toString() === userId.toString()){
            req.user.contact.push(user[i]);
            req.user.messagereq.splice(i, 1)
        }
    }

    req.user.save((err, user) =>{
        if(err) return res.status(400).send(err)
        res.json({
            accepted: true,
        })
    })
    
})

// Update user

app.put('/api/update', async (req, res)=>{
    try{
        const userId = req.query._id

        const data = {
            name: {
                fname: req.body.firstName,
                lname: req.body.lastName
            }
        } 
        const upuser = await User.findByIdAndUpdate(userId, {$set: data}, {new: true})
        res.json({
            update: true,
            upuser
        })
    } catch(err) {
        res.status(400).send(err)
    }

})

// Update Password

app.put('/api/update_pass', auth, (req, res) =>{
    req.user.comaprePassword(req.body.confirm_password, (err, isMatch)=>{
        if(err) return res.status(400).send(err)
        if(!isMatch) return res.json({
            error: true,
            message: 'Inavlid Password'
        })
        req.user.password = req.body.new_pass
        req.user.save((err, user) =>{
            if( err ) return res.status(400).send(err)
            res.json({
                update: true,
                user
            })
        })
    })
})

// Socket Implementation

io.on('connection', (socket) =>{
    console.log('user connectd')
    socket.on('refreshMessage', (data) =>{
        console.log(data)
        io.emit('refreshMessageReciver', data)
    })
})


// Port Listener
const port = 1010 || process.env.PORT;
server.listen(port, (err)=>{
    try{
        if(err) return console.log(err)
        console.log(`Server is Running at port ${port}`)
    }
    catch (err){
        console.error(err)
    }
})