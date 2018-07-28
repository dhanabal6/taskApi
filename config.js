const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
/* mongodb for dev */
mongoose.connect(
	"mongodb://taskapp:taskapp6@ds255451.mlab.com:55451/taskapp",
	{ useNewUrlParser: true }
);
mongoose.connection.on("error", err => {
	console.error(` Monogdb connection Error ${err.message}`);
});
