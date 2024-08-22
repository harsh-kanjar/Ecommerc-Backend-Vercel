const jwt = require('jsonwebtoken');
const jwt_s = "imharshkanjar@127.0.0.1/#"

fetchuser = (req, res, next) => {
    try {

        // Get the user from the jwt token and add it to req object
        const token = req.header("auth-token");
        if (!token) {
            return res.status(401).send({ error: "Authenticate using valid token..!" });
        }
        const data = jwt.verify(token, jwt_s);
        req.user = data.user;
    } catch (error) {
        res.status(401).send({ error: "Authenticate using valid token..!" });
    }


    next();
}


module.exports = fetchuser;