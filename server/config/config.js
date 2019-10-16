const config = {
    production: {
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default: {
        SECRET: '12345',
        DATABASE: 'mongodb://localhost:27017/chat'
    }
}

exports.get = function(env){
    return config[env] || config.default
}