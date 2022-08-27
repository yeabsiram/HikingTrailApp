const mongoose = require("mongoose");
const setAndSend = require("./setAndSendResponseModule");

const Hiking = mongoose.model(process.env.MODEL_NAME_TRAIL);



function getOne(req, res) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else
  {
    Hiking.findById(trailId)
          .exec()
          .then(hikingTrail => _fillResponse(res, hikingTrail))
          .catch(err => setAndSend.errorHandler(err, res));
  }

  
}

function deleteOne(req, res) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else
  {
    Hiking.findByIdAndDelete(trailId)
              .exec()
              .then((hikingTrail) => _fillResponse(res, hikingTrail._id))
              .catch((err) => setAndSend.errorHandler(err, res));
  }
}

function getAll(req, res) {
  let offset = parseFloat(process.env.OFFSET, 10);
  let count = parseFloat(process.env.COUNT, 10);
  const maxCount = parseFloat(process.env.MAX_COUNT, 10);


  if (req.query.offset) {
    offset = parseInt(req.query.offset, 10);
  }
  if (req.query.count) {
    count = parseInt(req.query.count, 10);
  }
  if (isNaN(offset) || isNaN(count)) {
 
    setAndSend.setResponse(res,process.env.REST_API_BAD_REQUEST, process.env.REST_API_COMMON_ERRORS_OFFSET_AND_COUNT);
  }
  if (count > maxCount) {
    
    setAndSend.setResponse(res,process.env.REST_API_BAD_REQUEST, process.env.REST_API_COMMON_ERRORS_MAX_COUNT);
  }
  

  Hiking.find()
        .skip(offset)
        .limit(count)
        .exec()
        .then((hikingTrail) => _fillResponse(res, hikingTrail))
        .catch((err) => setAndSend.errorHandler(err, res));
}
function search(req, res)
{
  console.log("here");
    const searchValue = req.query.searchValue;
    const limit = parseInt(process.env.SEARCH_COUNT, 10);

    Hiking.find({
      $or: [
        {'name': searchValue},
        {'city': searchValue},
        {'state': searchValue}
      ]
    }).limit(limit).exec().then((trail)=> _fillResponse(res, trail))
             .catch((err)=> setAndSend.errorHandler(err, res));
}
function addOne(req, res) {
  
  const newHikingTrail = {
    name: req.body.name,
    state: req.body.state,
    city: req.body.city,
    startingCoordinates: req.body.startingCoordinates,
    endingCoordinates: req.body.endingCoordinates,
    isALoop: req.body.isALoop,
    length: req.body.length,
    imageUrl: req.body.imageUrl, 
    plants: [],
    wildLife: []
    // plants: req.body.plants,
    // wildLife: req.body.wildLife,
  };
  
  Hiking.create(newHikingTrail)
    .then((hikingTrail) => _fillResponse(res, hikingTrail))
    .catch((err) => setAndSend.errorHandler(err, res));
}

function fullUpdateOne(req, res) {
  _updateOne(req, res, hikingTrailFullUpdate);
}

function hikingTrailFullUpdate(req, res, hikingTrail) {
  hikingTrail.name = req.body.name;
  hikingTrail.state = req.body.state;
  hikingTrail.city = req.body.city;
  hikingTrail.startingCoordinates = req.body.startingCoordinates;
  hikingTrail.endingCoordinates = req.body.endingCoordinates;
  hikingTrail.isALoop = req.body.isALoop;
  hikingTrail.length = req.body.length;
  hikingTrail.imageUrl = req.body.imageUrl;

  hikingTrail.save()
             .then(updatedTrail=> _fillResponse(res, updatedTrail))
             .catch(err => setAndSend.errorHandler(err, res));
}

function partialUpdateOne(req, res) {
  _updateOne(req, res, _hikingTrailPartialUpdate);
}


function _hikingTrailPartialUpdate(req, res, hikingTrail) {
 
  if (req.body.name) {
    hikingTrail.name = req.body.name;
  }
  if (req.body.state) {
    hikingTrail.state = req.body.state;
  }
  if (req.body.city) {
    hikingTrail.city = req.body.city;
  }
  if (req.body.startingCoordinates) {
    hikingTrail.startingCoordinates = req.body.startingCoordinates;
  }
  if (req.body.endingCoordinates) {
    hikingTrail.endingCoordinates = req.body.endingCoordinates;
  }
  if (req.body.isALoop) {
    hikingTrail.isALoop = req.body.isALoop;
  }
  if (req.body.length) {
    hikingTrail.length = req.body.length;
  }
  if(req.body.imageUrl)
  {
    hikingTrail.imageUrl = req.body.imageUrl;
  }

  hikingTrail.save()
             .then(updatedTrail=> _fillResponse(res, updatedTrail))
             .catch(err => setAndSend.errorHandler(err, res));
};

function _updateOne(req, res, updateTrailCallback) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else
  {
    Hiking.findById(trailId).exec()
                          .then(hikingTrail => _hikingTrailUpdate(req, res, hikingTrail, updateTrailCallback))
                          .catch(err=>setAndSend.errorHandler(err, res));

  }
}

function _hikingTrailUpdate(req, res, hikingTrail, updateTrailCallback)
{
    if(!hikingTrail)
    {
      _fillResponse(res, hikingTrail);
    }
    else{
      updateTrailCallback(req, res, hikingTrail);
    }

}

function _fillResponse(res, hikingTrail)
{
  let status;
  let message;
  if(!hikingTrail)
  {
     status = parseInt(process.env.REST_API_RESOURCE_NOT_FOUND, 10);
     message = process.env.REST_API_RESOURCE_NOT_FOUND_MESSAGE
     
  }
  else{
    status = parseInt(process.env.REST_API_OK, 10);
    message = hikingTrail;
  }
  setAndSend.setResponse(res, status, message);
}

module.exports = {
  getAll,
  addOne,
  deleteOne,
  getOne,
  fullUpdateOne,
  partialUpdateOne,
  search
};
