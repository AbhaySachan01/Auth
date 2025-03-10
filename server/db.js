const mongoose = require("mongoose");
function connect() {
    try {
        mongoose.connect(process.env.DB); 
        console.log("Connect ho gaya");
    } catch (error) {
        console.log("Error:", error);
    }
}

module.exports = connect;
