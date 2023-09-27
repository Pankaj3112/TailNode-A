
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
    },
    image: {
        type: String,
    },
    likes: {
        type: Number,
    },
    tags: [
		{
        	type:String,
    	}
	],
    text: {
		type: String,
	},
	publishDate: {
		type: String,
	},

	owner: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
	}
});


const Post = mongoose.model('Post', postSchema);
module.exports = Post;