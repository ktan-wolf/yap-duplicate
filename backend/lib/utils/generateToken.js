const jwt = require('jsonwebtoken');

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: '15d'
    });

    res.cookie("jwt", token,{
        maxAge: 15*24*60*60*1000, //15days in miliseconds
        httpOnly: true,           // prevent XSS attacks cross site scripting attacks
        sameSite: "None",        // CSRF attacks cross site request forgery attacks
        secure: true,
        
    })

    return token;
}

module.exports = generateTokenAndSetCookie;