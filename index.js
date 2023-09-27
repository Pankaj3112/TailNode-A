const db = require('./config/mongoose');
const axios = require('axios');
const base = `https://dummyapi.io/data/v1/`;

//Models
const User = require('./models/user');
const Post = require('./models/post');

const customHeaders = {
	'app-id': '6513f5de2a878433bd3139b6',
};


//fetching users from api 
async function fetchUsers(){
	try{
		const url = `${base}user`;

		const response = await axios.get(url, {
		  headers: customHeaders
		});
	
		const apiData = response.data;
		const data = apiData.data;
	
		await saveUsersToDB(data);
	}
	catch (err){
		console.log('Error-->', err);
	}
}

// saving users to db
async function saveUsersToDB(data) {
	await Promise.all(data.map(async (user) => {
	  try {
		// Check if user exists
		let userExists = await User.findById(user.id);

		// If user does not exist, create user
		if (!userExists) {
		  let userRef = await User.create({
			_id: user.id,
			title: user.title,
			firstName: user.firstName,
			lastName: user.lastName,
			picture: user.picture,
			posts: [],
		  });
		  console.log('User created', userRef);
		}
	  } catch (err) {
		console.log('Error something went wrong', err);
	  }
	}));
}
			
//fetching posts from api
async function fetchPosts(){
	try{
		// Get all users from db
		let users = await User.find({});

		// Loop through users and fetch their posts and save to db
		users.forEach(async (user) => {
			let id = user._id;

			const url = `${base}user/${id}/post`;
			
			const response = await axios.get(url, {
				headers: customHeaders
			});
		
			const apiData = response.data;
			const data = apiData.data;
			
			await savePostsToDB(data);
		});
	}
	catch (err){
		console.log('Error-->', err);
	}
}

//saving posts to db
async function savePostsToDB(data) {
	await Promise.all(data.map(async (post) => {
	  try {
		// Check if post exists
		let postExists = await Post.findById(post.id);

		// If post does not exist, create post
		if (!postExists) {
		  let postRef = await Post.create({
			_id: post.id,
			image: post.image,
			likes: post.likes,
			tags: post.tags,
			text: post.text,
			publishDate: post.publishDate,
			owner: post.owner.id,
		  });
  
		  // Add post to user's posts array
		  let user = await User.findById(post.owner.id);
		  user.posts.push(postRef);
		  await user.save();
  
		  console.log('Post created', postRef);
		}
	  } catch (err) {
		console.log('Error something went wrong', err);
	  }
	}));
}


//main function
async function main(){
	console.log('Fetching users...');
	await fetchUsers();
	console.log('Fetching posts...');
	await fetchPosts();
}

main();