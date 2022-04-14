const User = require('../models/user');
const jwt = require('jsonwebtoken');

const tokenAge = 60 * 5;

const generateToken = (id)=>{
    return jwt.sign({id}, 'super secret phrase', {expiresIn: tokenAge});
}

const identifyErrors = (error) => {
    console.log(error.message);
    //handle errors on login

    let errors = {
        email: '',
        password: ''
    }

    if(error.message === 'invalid email') {
        errors.email = 'email not found'
    }

    if(error.message === 'invalid password') {
        errors.password = 'oops, invalid password';
    }

    return errors;
}


module.exports.postRegister = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({email, password});
        const token = generateToken(user._id);
        res.cookie('userToken', token, {httpOnly: true});
        res.status(201).json({token});
        //res.render('index');
    }
    catch(error) {
        console.log(error);
        res.status(400).json(error);
    }
    
   // res.send('registration');
}

module.exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.userLogin(email, password);
        const token = generateToken(user._id);
        res.cookie('userToken', token, {httpOnly: true});
        res.status(200).json({user: user._id});
    } catch (error) {
        const errors = identifyErrors(error);
        res.status(400).json({errors});
    }
}

module.exports.getRegister = (req, res) => {
    res.render('register');
}

module.exports.getLogin = (req, res) => {
    res.render('login');
}


module.exports.getMainPage = (req, res) => {
    res.render('index');
}

module.exports.getLogout = (req, res) => {
    res.cookie('userToken', '', {httpOnly: true, maxAge: 1});
    res.redirect('/');
}