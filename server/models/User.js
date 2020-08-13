const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


let User;

if (!User) {
	let userSchema = new Schema({
		email: { type: String, required: true, lowercase: true, unique: true },
		password: { type: String, required: true },

		// Fields related to account activation
		activated: { type: Boolean },
		activationToken: { type: String, unique: true, sparse: true },
		activationTokenSentAt: { type: Date },
		activatedAt: { type: Date },

		// Fields related to reset password
		resetPasswordToken: { type: String, unique: true, sparse: true },
		resetPasswordTokenSentAt: { type: Date },

		// Payments related
		stripeDetails: {}
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

	userSchema.statics.toClientObject = function(user) {
		const userObject = user.toObject() || {};

		const clientObject = {
			_id: userObject._id,
			email: userObject.email,
			activated: userObject.activated,
			stripeDetails: userObject.stripeDetails,
			createdAt: userObject.createdAt,
			updatedAt: userObject.updatedAt,
		};

		return clientObject;
	}

	userSchema.statics.saveStripeCustomer = async function(id, customer) {
		const updatedUser = await this.findOneAndUpdate(
			{ _id: id },
			{ 'stripeDetails.customer': customer },
			{ new: true }
		);
		return updatedUser;
	}

	userSchema.statics.saveStripeSubscription = async function(id, subscription) {
		const updatedUser = await this.findOneAndUpdate(
			{ _id: id },
			{ 'stripeDetails.subscription': subscription },
			{ new: true }
		);
		return updatedUser;
	}


	User = mongoose.model('User', userSchema);	
}

module.exports = User;
