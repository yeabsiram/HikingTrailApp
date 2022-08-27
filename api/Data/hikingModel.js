const mongoose = require('mongoose');


const trailPlantsSchema = mongoose.Schema({
    name: String,
    type: String,
    plantWithFruit: Boolean
});

const  trailWildLifeSchema = mongoose.Schema({
    name: String,
    type: String,
    isDangerous: Boolean
});

const hikingTrailSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        state: String,
        city: String,
        startingCoordinates: String,
        endingCoordinates: String,
        isALoop: Boolean,
        length: {
            type: String,
        },
        imageUrl: String,
        plants: [trailPlantsSchema],
        wildLife: [trailWildLifeSchema]
    }
);

mongoose.model(process.env.MODEL_NAME_TRAIL, hikingTrailSchema, process.env.DB_NAME_TRAIL);