const mongoose = require('mongoose'),
	Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config').get(process.env.NODE_ENV)
let saltI = 10;

const userSchema = mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
		maxlength: 50,
		minlength: 4
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	name: {
		fname: {
			type: String,
			minlength: 3,
			maxlength: 50
		},
		lname: {
			type: String,
			minlength: 3,
			maxlength: 50
		}
	},
	logs: {
		last_login: {
			type: Date
		},
		last_modified_password: {
			type: Date
		},
		last_active: {
			type: Date
		}
	},
	state: {
		type: Boolean
	},
	messagereq: [{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation'
		},
		accepted: {
			type: Boolean
		}
	}],
	contact: [{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		conversationId: {
			type: Schema.Types.ObjectId,
			ref: 'Conversation'
		}
	}],
	token: {
		type: String
	}
}, {timestamps: true})


userSchema.pre('save', async function(){
	const user = this;
	if(user.isModified('password')){
		const salt = bcrypt.genSaltSync(saltI);
		const hash = bcrypt.hashSync(user.password, salt);
		user.password = hash
	}
})
// Methods
userSchema.methods.comaprePassword = function(candidatePassword, cb){
	const user = this;

	bcrypt.compare(candidatePassword, user.password, function(err, isMatch){
		if(err) return cb(err)
		cb(null, isMatch)
	})

}

userSchema.methods.generateTokenAndUpdateState = function(data, cb){
	const user = this;
	let token = jwt.sign(user._id.toHexString(), config.SECRET);
	user.token = token
	user.logs.last_login = data.timeLog
	user.state = true

	user.save((err, user)=>{
		if(err) return cb(err);
		cb(null, user)
	})

}

userSchema.methods.deleteTokenAndUpdateState = function(data, cb){
	const user = this;

	user.token = null
	user.state = false
	user.logs.last_active = data.timeLogout

	user.save((err, user)=>{
		if(err) return cb(err)
		cb(null, user)
	})

}

// Statics
userSchema.statics.findByToken = function(token, cb){
	const user = this;
	jwt.verify(token, config.SECRET, (err, decode)=>{
		// if(err) throw err;
		user.findOne({_id: decode, "token": token}, (err, user)=>{
			if(err) cb(err)
			cb(null, user)
		})
	})
}



const User = mongoose.model('User', userSchema);


module.exports = {User}