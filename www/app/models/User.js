var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * Validators
 */
var validatePresenceOf = function(value) {
	// If you are authenticating by any of the oauth strategies, don't validate.
	return (this.provider && this.provider !== 'local') || (value && value.length);
};

var validateUniqueEmail = function(value, callback) {
	var User = mongoose.model('User');
	User.find({$and: [{email : value}, { _id: { $ne : this._id }}]}, function(err, user) {
		callback(err || user.length === 0);
	});
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/, 'Please enter a valid email'],
		validate: [validateUniqueEmail, 'E-mail address is already in-use']
	},
	username: {
		type: String,
		unique: true,
		required: true
	},
	roles: {
		type: Array,
		default: ['authenticated']
	},
	hashed_password: {
		type: String,
		validate: [validatePresenceOf, 'Password cannot be blank']
	},
	provider: {
		type: String,
		default: 'local'
	},
	salt: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	facebook: {}
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
	this._password = password;
	this.salt = this.makeSalt();
	this.hashed_password = this.hashPassword(password);
}).get(function() {
	return this._password;
});

/**
 * Methods
 */
UserSchema.methods = {
	/**
	 * Authenticate - check if the passwords are the same
	 *
	 * @param {String} plainText
	 * @return {Boolean}
	 * @api public
	 */
	authenticate: function(plainText) {
		return this.hashPassword(plainText) === this.hashed_password;
	},

	/**
	 * Make salt
	 *
	 * @return {String}
	 * @api public
	 */
	makeSalt: function() {
		return crypto.randomBytes(16).toString('base64');
	},

	/**
	 * Hash password
	 *
	 * @param {String} password
	 * @return {String}
	 * @api public
	 */
	hashPassword: function(password) {
		if (!password || !this.salt) return '';
		var salt = new Buffer(this.salt, 'base64');
		return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
	}
};

mongoose.model('User', UserSchema);