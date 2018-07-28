const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	organizationEmail: String,
	organizationPassword: String,
	email: String,
	uploadFile: {
		type: String,
		default: null
	}
});

module.exports = mongoose.model("user", userSchema);
