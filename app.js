const express = require('express')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const bcrypt = require('bcrypt')
//const Role = require('./models/role')

/*Role.estimatedDocumentCount((err, count) => {
    if(!err && count === 0) {
        new Role({title: "admin"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'admin' to roles collection");
        });
        new Role({title: "author"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'author' to roles collection");
        });
        new Role({title: "user"}).save((err) => {
            if(err) {
                console.log("error", err);
            }
            console.log("added 'user' to roles collection");
        });
    }
})*/

dotenv.config()

//===================== db connect ==========================
mongoose.connect(process.env.MONGO_URL).then(() => console.log("db connected", bcrypt.hashSync("Password0000", 10)))

mongoose.connection.on(("error"), err => {
    console.log(`db connection error: ${err.message}`)
})

const app = express()

//======== import routes =================
const routes = require("./routes/route")

//===== middleware ========
app.use(morgan('dev'));


app.use(bodyParser.json());
app.use(expressValidator());
app.use("/api", routes);

const port = process.env.PORT || 3500

app.listen(port, () => {
    console.log('vous etes connecte sur le port: ', port)
})