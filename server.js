const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const mainRoutes = require('./routes/mainRoute');

mongoose.connect('mongodb://localhost:27017/jwtokenDB', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(mainRoutes);

//a route to send the cookie
app.get('/send-cookie', (req, res) => {
    //register a cookie in a browser
    //res.setHeader('Set-Cookie', 'newCookie=true');

    res.cookie('newCookie', false, {httpOnly: true});
    res.cookie('tempCookie', true, {maxAge: 1000*60*60});
    res.send('you got the cookie');
});


//get the cookie
app.get('/get-cookie', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);

    const {newCookie} = cookies;
    console.log(newCookie);

    res.json(cookies);
});


app.listen(5000, () => {
    console.log('server is running');
});
