const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
    try {
        var token = req.headers.authorization.split(" ")[1];
        var decode = jwt.verify(token, process.env.JWT_TOKEN);

        const userLogin = await db.userModel.findOne({
            where: {
                email: decode.email
            }
        });
        req.user = userLogin
        next();

    } catch (e) {
        console.log(e)
        res.status(401).json({
            error: "Auth Failed"
        })

    }
}

