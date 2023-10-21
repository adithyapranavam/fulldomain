const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
 const cookieParser = require("cookie-parser");

const connectDB = require('./server/database/connection');
// const { start } = require("repl");

const app = express();


dotenv.config({path:'config.env'})
const PORT = process.env.PORT||3000

//log requests
app.use(morgan('tiny'));

//mongodb connection
connectDB();

// session and cookie
app.use(cookieParser());

app.use(session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true, 
        cookie: { secure: false },
    })
);

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

//parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

//set view engine
app.set("view engine","ejs");

// load assets
app.use('/css',express.static(path.resolve(__dirname,"assets/css")))
app.use('/js',express.static(path.resolve(__dirname,"assets/js")))


// loud routers
app.use('/',require('./server/routes/router'))
// app.use('/admin',require('./server/routes/adminrouter'))

app.listen(PORT,()=>{console.log(`server is running on http://localhost:${PORT}`)});
