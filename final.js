
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
let finalUser;
var finalUsers = new Schema({
    "email"     : {unique: true, type: String},
    "password"  : String
})
const bcrypt = require('bcryptjs');

module.exports.startDB = () => {
    return new Promise(function(resolve, reject) {
        var db1 = mongoose.createConnection("mongodb+srv://AlexDB:Alexander1028@senecaweb.oozwx6e.mongodb.net/bti325_a6", {useNewUrlParser: true, useUnifiedTopology: true});
        db1.on('error', (err)=>{
            console.log("Cannot connect to DB.");
            reject(err);
        });
        db1.once('open', ()=>{
            console.log("DB connection successful");
            finalUser = db1.model("finalUsers", finalUsers);
            resolve();
        });
    })
}
module.exports.register = (user) => {
    return new Promise(function(resolve, reject){
        if (user.email.trim() == "" || user.password.trim() == "") {
            reject("Error: email or password cannot be empty.");
        }
        else {
            bcrypt.hash(user.password, 10).then(function(hash) {
                user.password = hash;
                let newUser = new finalUser(user);
                newUser.save(function(err){
                    if (err) {
                        if (err.code == 11000) {
                            reject(user.email + " already exists");
                        }
                        else {
                            reject("Error: cannot create the user");
                        }
                    }
                    else {
                        resolve();
                    }
                });
            }).catch(function(err) {
                reject("Error during password hashing");
            })
        }
    })
}
module.exports.signIn = (user) => {
    return new Promise(function(resolve, reject) {
        finalUser.findOne({email: user.email}).exec().then(function(foundUser){
            if (foundUser == null) {
                reject("Unable to find user with email: " + user.email);
            }
            else {
                bcrypt.compare(user.password, foundUser.password).then(function(result){
                    if (result == true) {
                        resolve(foundUser);
                    }
                    else {
                        reject("Incorrect password for user: " + user.email);
                    }
                })
            }
        })
    })
}