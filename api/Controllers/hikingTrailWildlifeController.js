const mongoose = require('mongoose');
const setAndSend = require('./setAndSendResponseModule');

const Hiking = mongoose.model(process.env.MODEL_NAME_TRAIL);


function getAll(req, res)
{
    const trailId = req.params.trailId;
   
    if(!mongoose.isValidObjectId(trailId))
    {
      setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
    }
    else{
      console.log("i am here");
      Hiking.findById(trailId)
      .select("wildLife")
      .exec()
      .then(hikingTrail => _fillResponse(res, hikingTrail.wildLife))
      .catch(err => setAndSend.errorHandler(err, res));
    }

}


function addOne(req, res)
{
    const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
   
  else{

    Hiking.findById(trailId).exec()
                            .then(hikingTrail=> _hikingTrailWildLifeHelper(req, res, hikingTrail, _addWildLife))
                            .catch(err=> setAndSend.errorHandler(err, res));
  }
}


function _addWildLife(req, res, hiking)
{
 
    const hikingTrailWildlife = {
        name: req.body.name,
        type: req.body.type,
        isDangerous: req.body.isDangerous
    };

    hiking.wildLife.push(hikingTrailWildlife);
    hiking.markModified("wildLife");

    hiking.save().then(hikingTrail => _fillResponse(res, hikingTrail.wildLife))
                 .catch(err => setAndSend.errorHandler(err, res));
}

function getOne(req, res){
    const trailId = req.params.trailId;
    const wildLifeId = req.params.wildLifeId;

    if(!mongoose.isValidObjectId(trailId) || !mongoose.isValidObjectId(wildLifeId))
    {
      setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
    }
    else{
      Hiking.findById(trailId)
          .select("wildLife")
          .exec()
          .then(hikingTrail => hikingTrail.wildLife.id(wildLifeId))
          .then(hikingTrailWildlife =>_fillResponse(res, hikingTrailWildlife))
          .catch(err => setAndSend.errorHandler(err, res));
    }
}
function deleteOne(req, res)
{
    const trailId = req.params.trailId;

    if(!mongoose.isValidObjectId(trailId))
    {
      setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
    }
    else{
      Hiking.findById(trailId).select("wildLife")
                              .exec()
                              .then(hikingTrail => _hikingTrailWildLifeHelper(req, res, hikingTrail, _delteOne))
                              .catch(err => setAndSend.errorHandler(err, res));

    }
}

function _delteOne(req, res, hiking)
{
    const wildLifeId = req.params.wildLifeId;
    
    if(!mongoose.isValidObjectId(wildLifeId) || !hiking.wildLife.id(wildLifeId))
    {
      setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
    }
    else
    {
      hiking.wildLife.id(wildLifeId).remove();

      hiking.markModified('wildLife');
      hiking.save().then(_fillResponse(res, wildLifeId))
                   .catch(err => setAndSend.errorHandler(err, res));
    }
}

function fullUpdateOne(req, res) {

    _updateOne(req, res, _fullWildLifeUpdate);

};

function partialUpdateOne(req, res) {
    
    _updateOne(req, res, _partialWildLifeUpdate);

};

function _updateOne(req, res, wildLifeUpdateCallback) {

  const trailId = req.params.trailId;

  if(!mongoose.isValidObjectId(trailId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else{
    Hiking.findById(trailId)
    .select("wildLife")
    .exec()
    .then(hikingTrail => _hikingTrailWildLifeHelper(req, res, hikingTrail, wildLifeUpdateCallback))
    .catch(err => setAndSend.errorHandler(err, res));
  }
}

const _fullWildLifeUpdate = function (req, res, hikingTrail) {
  const wildLifeId = req.params.wildLifeId; 
  
  if(!mongoose.isValidObjectId(wildLifeId) || !hikingTrail.wildLife.id(wildLifeId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else
  { 
    hikingTrail.wildLife.id(wildLifeId).name = req.body.name;
    hikingTrail.wildLife.id(wildLifeId).type = req.body.type;
    hikingTrail.wildLife.id(wildLifeId).isDangerous = req.body.isDangerous;

    hikingTrail.save()
               .then(updatedTrail => updatedTrail.wildLife.id(wildLifeId))
               .then(updatedTrailWildLife => _fillResponse(res, updatedTrailWildLife))
               .catch(err => setAndSend.errorHandler(err, res));
  }
};

const _partialWildLifeUpdate = function (req, res, hikingTrail) {
   
  const wildLifeId = req.params.wildLifeId;
   
  if(!mongoose.isValidObjectId(wildLifeId) || !hikingTrail.wildLife.id(wildLifeId))
  {
    setAndSend.setResponse(res, process.env.REST_API_RESOURCE_NOT_FOUND,  process.env.REST_API_COMMON_ERRORS_INVALID_ID);
  }
  else                                    
  {
    if (req.body.name) {
      hikingTrail.wildLife.id(wildLifeId).name = req.body.name;
    }
    if (req.body.type) {
      hikingTrail.wildLife.id(wildLifeId).type = req.body.type;
    }
    if (req.body.isDangerous) {
      hikingTrail.wildLife.id(wildLifeId).isDangerous = req.body.isDangerous;
    }
   
    hikingTrail.save()
               .then(updatedTrail => updatedTrail.wildLife.id(wildLifeId))
               .then(updatedTrailWildLife => _fillResponse(res, updatedTrailWildLife))
               .catch(err => setAndSend.errorHandler(err, res));
  }

};
function _hikingTrailWildLifeHelper(req, res, hikingTrail, trailPlantCallback)
{
  if(!hikingTrail)
  {
    _fillResponse(res, hikingTrail);
  }
  else{
    trailPlantCallback(req, res, hikingTrail);
  }
}
function _fillResponse(res, wildLife)
{
  let status;
  let message;
  if(!wildLife)
  {
     status = parseInt(process.env.REST_API_RESOURCE_NOT_FOUND, 10);
     message = process.env.REST_API_RESOURCE_NOT_FOUND_MESSAGE
     
  }
  else{
    status = parseInt(process.env.REST_API_OK, 10);
    message = wildLife;
  }
  setAndSend.setResponse(res, status, message);
}

module.exports = {getAll, addOne, deleteOne, getOne, partialUpdateOne, fullUpdateOne};