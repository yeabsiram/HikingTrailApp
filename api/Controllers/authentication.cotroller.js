const jwt = require('jsonwebtoken');
const util = require('util');
const setAndSendResponse = require('./setAndSendResponseModule');

const authenticate = function(req, res, next)
{
    const headerExists = req.headers.authorization;
 

    if(headerExists)
    {
        const token = req.headers.authorization.split(" ")[1];
        
        // console.log(jwt.verify(token, process.env.JWT_PASSWORD));
        const jwtVerifyPromise = util.promisify(jwt.verify, { context: jwt});

        jwtVerifyPromise(token, process.env.JWT_PASSWORD)
                    .then(()=> next())
                    .catch((err)=> {setAndSendResponse.setResponse(res, process.env.UNAUTHORIZED,  process.env.REST_API_UNAUTHORIZED_MESSAGE);});
    }
    else
    {
        setAndSendResponse.setResponse(res, process.env.UNAUTHORIZED,  process.env.REST_API_UNAUTHORIZED_MESSAGE);
    }

}

module.exports = { authenticate};