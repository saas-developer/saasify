const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let User;

if (!User) {
	let userSchema = new Schema({
		email: { type: String, required: true, lowercase: true, unique: true },
		password: { type: String, required: true }
	},
	{
		timestamps: true
	});

	User = mongoose.model('User', userSchema);	
}

module.exports = User;
