const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


let User;

if (!User) {
	let userSchema = new Schema({
		email: { type: String, required: true, lowercase: true, unique: true },
		password: { type: String, required: true }
	},
	{
		timestamps: true
	});


	userSchema.pre('save', function(next) {
		// this
		const user = this;

		const SALT_FACTOR = 5;

		if (!user.isModified('password')) {
			return next();
		}

		bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
			if (err) {
				return next(err);
			}

			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;

				next();
			})
		})
	});


	userSchema.methods.comparePassword = function(candidatePassword, callback) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, isMatch);
		})
	}

	User = mongoose.model('User', userSchema);	
}

module.exports = User;
