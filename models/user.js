const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    unread:{
        type: Array,
        required: false
    }
});

const user = mongoose.model("user", userSchema);
module.exports = user;