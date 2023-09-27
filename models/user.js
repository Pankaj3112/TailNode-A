const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    title: {
        type:String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type:String,
    },
    picture: {
		type: String,
	},

	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post'
		}
	]
});


const User = mongoose.model('User', userSchema);
module.exports = User;