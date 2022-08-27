function sendResponse(res, response)
{
  
  res.status(response.status).json(response.message);
}


function setResponse( res, status, message)
{

    const response = {status:"", message:""};
   
    response.status = parseInt(status, 10);
    response.message = message;
    
  
    sendResponse(res, response)
    
}
function errorHandler(err, res)
{
  console.log(err);
  const response = {
                      status: parseInt(process.env.REST_API_INTERNAL_SERVER_ERROR, 10), 
                      message:{
                                  message: process.env.REST_API_INTERNAL_SERVER_ERROR_MESSAGE,
                                  
                              }
                    };
  sendResponse(res, response);

}



module.exports = {sendResponse, setResponse, errorHandler};
