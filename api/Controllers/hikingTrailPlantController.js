const mongoose = require("mongoose");
const setAndSend = require("./setAndSendResponseModule");

const Hiking = mongoose.model(process.env.MODEL_NAME_TRAIL);

function getAll(req, res) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{

    Hiking.findById(trailId)
    .select("plants")
    .exec()
    .then(hikingTrail => _fillResponse(res, hikingTrail.plants))
    .catch(err => setAndSend.errorHandler(err, res));
  }

}

function addOne(req, res) {
  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{

      Hiking.findById(trailId).exec()
                  .then(hikingTrail =>_hikingTrailPlantHelper(req, res, hikingTrail, _addPlant))
                  .catch(err=>setAndSend.errorHandler(err, res));
  }
}

function _addPlant(req, res, hiking) {
  const hikingTrailPlants = {
    name: req.body.name,
    type: req.body.type,
    plantWithFruit: req.body.plantWithFruit,
  };

  hiking.plants.push(hikingTrailPlants);
  hiking.markModified("plants");

  hiking.save().then((hikingTrail)=> _fillResponse(res, hikingTrail.plants))
               .catch((err)=> setAndSend.errorHandler(err, res));  
}

function getOne(req, res) {
  const trailId = req.params.trailId;
  const plantId = req.params.plantId;

  if(!mongoose.isValidObjectId(trailId) || !mongoose.isValidObjectId(plantId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{

      Hiking.findById(trailId)
        .select("plants")
        .exec()
        .then(hikingTrail => hikingTrail.plants.id(plantId))
        .then(hikingTrailPlant => _fillResponse(res, hikingTrailPlant))
        .catch(err => setAndSend.errorHandler(err, res)); 
    }
}
function deleteOne(req, res) {
  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{
    
    Hiking.findById(trailId)
          .select("plants")
          .exec()
          .then(hikingTrail => _hikingTrailPlantHelper(req, res, hikingTrail, _deleteOne))
          .catch(err => setAndSend.errorHandler(err, res));
  }
}

function _deleteOne(req, res, hiking) {
  const plantId = req.params.plantId;

  if(!mongoose.isValidObjectId(plantId) || !hiking.plants.id(plantId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else
  {
    hiking.plants.id(plantId).remove(); 

    hiking.markModified("plants");
    hiking.save().then(_fillResponse(res, plantId))
                 .catch(err => setAndSend.errorHandler(err, res));
  }
}

function fullUpdateOne(req, res) {

    _updateOne(req, res, _fullPlantUpdate);

};

function partialUpdateOne(req, res) {
    
    _updateOne(req, res, _partialPlantUpdate);

};

function _updateOne(req, res, trailPlantUpdateCallback) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{
    Hiking.findById(trailId)
          .select("plants")
          .exec()
          .then((hikingTrail)=> _hikingTrailPlantHelper(req, res, hikingTrail, trailPlantUpdateCallback))
          .catch((err) => setAndSend.errorHandler(err, res));
  }
}

const _fullPlantUpdate = function (req, res, hikingTrail) {

  const plantId = req.params.plantId;

  if(!mongoose.isValidObjectId(plantId) || !hikingTrail.plants.id(plantId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
   }
  else
  {
    hikingTrail.plants.id(plantId).name = req.body.name;
    hikingTrail.plants.id(plantId).type = req.body.type;
    hikingTrail.plants.id(plantId).plantWithFruit = req.body.plantWithFruit;
    
    hikingTrail.save().then(updatedTrail=>updatedTrail.plants.id(plantId))
                      .then(updatedTrailPlant => _fillResponse(res, updatedTrailPlant))
                      .catch(err=> setAndSend.errorHandler(err, res));      
  }
};

const _partialPlantUpdate = function (req, res, hikingTrail) {
   
  const plantId = req.params.plantId;
  
  if(!mongoose.isValidObjectId(plantId) || !hikingTrail.plants.id(plantId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else                                    
  {
    if (req.body.name) {
      hikingTrail.plants.id(plantId).name = req.body.name;
    }
    if (req.body.type) {
      hikingTrail.plants.id(plantId).type = req.body.type;
    }
    if (req.body.plantWithFruit) {
      
      hikingTrail.plants.id(plantId).plantWithFruit = req.body.plantWithFruit;
  
    }
  
    hikingTrail.save()
                      .then(updatedTrail=>updatedTrail.plants.id(plantId))
                      .then(updatedTrailPlant => _fillResponse(res, updatedTrailPlant)) 
                      .catch(err=>setAndSend.errorHandler(err, res))
  }
};

function _hikingTrailPlantHelper(req, res, hikingTrail, trailPlantCallback)
{
  if(!hikingTrail)
  {
    _fillResponse(res, hikingTrail);
  }
  else{
    trailPlantCallback(req, res, hikingTrail);
  }
}

function _fillResponse(res, plant)
{
  let status;
  let message;
  if(!plant)
  {
     status = parseInt(process.env.REST_API_RESOURCE_NOT_FOUND, 10);
     message = process.env.REST_API_RESOURCE_NOT_FOUND_MESSAGE
     
  }
  else{
    status = parseInt(process.env.REST_API_OK, 10);
    message = plant;
  }
  setAndSend.setResponse(res, status, message);
}

module.exports = { getAll, addOne, deleteOne, getOne, fullUpdateOne, partialUpdateOne};
