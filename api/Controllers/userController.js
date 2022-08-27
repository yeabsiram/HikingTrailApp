const mongoose = require('mongoose');
const User = mongoose.model(process.env.DB_USER_MODEL);
const bcrypt = require('bcrypt');
const setAndSendResponse = require('./setAndSendResponseModule');
const jwt = require('jsonwebtoken');


function _createUser(nameU, usernameU, hashedPassword)
{
    const user = {
        name: nameU,
        username: usernameU,
        password: hashedPassword
    };
    console.log(user);
    return User.create(user);
}
function _generateHash(saltValue, password)
{
    return bcrypt.hash(password, saltValue);
}


function addOne(req, res){
    console.log(req.body);
    if(req.body && req.body.username && req.body.password && req.body.name)
    {
        const numberOfRounds = parseInt(process.env.NUMBER_OF_ROUNDS, 10);

        bcrypt.genSalt(numberOfRounds)
              .then((saltValue) => _generateHash(saltValue, req.body.password))
              .then((hashPassword) => _createUser(req.body.name, req.body.username, hashPassword))
              .then((user)=> _fillResponse(res, user))
              .catch((error)=> setAndSendResponse.setResponse(res, process.env.REST_API_INTERNAL_SERVER_ERROR, process.env.REST_API_INTERNAL_SERVER_ERROR_MESSAGE));
    }
    else
    {
        setAndSendResponse.setResponse(res, process.env.REST_API_BAD_REQUEST, process.env.REST_API_PASSWORD_USERNAME_ERROR);
    }
}
function logIn(req, res)
{

    if(req.body && req.body.username && req.body.password)
    {
        const username = req.body.username;
        User.findOne({username: username}).exec()
                        .then((user) => {
                            if(!user)
                            {
                                setAndSendResponse.setResponse(res, process.env.UNAUTHORIZED, process.env.REST_API_UNAUTHORIZED_MESSAGE);
                            }
                            else{
                                // bcrypt.compare().then()

                                if(bcrypt.compareSync(req.body.password, user.password))
                                {
                                    const token = jwt.sign({name:user.username}, process.env.JWT_PASSWORD);
                                    setAndSendResponse.setResponse(res, process.env.REST_API_OK, {success: true, token: token});
                                }
                                else{
                                    setAndSendResponse.setResponse(res, process.env.UNAUTHORIZED, process.env.REST_API_UNAUTHORIZED_MESSAGE);
                                }
 
                            }
                        })
                        .catch((error)=> setAndSendResponse.setResponse(res, process.env.REST_API_INTERNAL_SERVER_ERROR, process.env.REST_API_INTERNAL_SERVER_ERROR_MESSAGE));
    }
    else{
        setAndSendResponse.setResponse(res, process.env.REST_API_BAD_REQUEST, process.env.REST_API_PASSWORD_USERNAME_ERROR);
    }

}

function _fillResponse(res, user)
{
  let status;
  let message;
  if(!user)
  {
     status = parseInt(process.env.REST_API_INTERNAL_SERVER_ERROR, 10);
     message = process.env.REST_API_FAILED_TO_REGISTER;
  }
  else{
    status = parseInt(process.env.REST_API_OK, 10);
    message = user;
  }
  setAndSendResponse.setResponse(res, status, message);
}

module.exports = {addOne, logIn};