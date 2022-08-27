const mongoose = require('mongoose');
require('./hikingModel');
require('./userModel');

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function(){
    console.log("DB Connected");
});

mongoose.connection.on('disconnected', function(){
    console.log("DB Disconnected");
});

mongoose.connection.on("error", function(err){
    console.log(err);
})

process.on("SIGINT", function(){
    mongoose.connection.close(function(){
        console.log("mongosse disconnected due to user input");
        process.exit(0);
    })
});
process.on("SIGTERM", function(){
    mongoose.connection.close(function(){
        console.log("DB connection terminated.");
        process.exit(0);
    })
});