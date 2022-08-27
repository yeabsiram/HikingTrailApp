const express = require('express');
const router = express.Router();
const authenticationController = require('../Controllers/authentication.cotroller');

const hikingTrailController = require('../Controllers/hikingTrailController');
const hikingTrailPlantController = require('../Controllers/hikingTrailPlantController');
const hikingTrailWildlifeController = require('../Controllers/hikingTrailWildlifeController');

router.route("/").get(hikingTrailController.getAll)
                      .post(authenticationController.authenticate, hikingTrailController.addOne);
                     
router.route("/:trailId").delete(authenticationController.authenticate, hikingTrailController.deleteOne)
                                .patch(authenticationController.authenticate, hikingTrailController.partialUpdateOne)
                                .put(authenticationController.authenticate, hikingTrailController.fullUpdateOne)
                                .get(hikingTrailController.getOne);

router.route("/:trailId/plants/").get(hikingTrailPlantController.getAll)
                             .post(authenticationController.authenticate,hikingTrailPlantController.addOne);

router.route("/:trailId/plants/:plantId").get(hikingTrailPlantController.getOne)
                        .delete(authenticationController.authenticate, hikingTrailPlantController.deleteOne)
                        .patch(authenticationController.authenticate, hikingTrailPlantController.partialUpdateOne)
                        .put(hikingTrailPlantController.fullUpdateOne);

router.route("/:trailId/wildLife/").get(hikingTrailWildlifeController.getAll)
                             .post(authenticationController.authenticate, hikingTrailWildlifeController.addOne);

router.route("/:trailId/wildLife/:wildLifeId").get(hikingTrailWildlifeController.getOne)
                        .delete(authenticationController.authenticate, hikingTrailWildlifeController.deleteOne)
                        .patch(authenticationController.authenticate,hikingTrailWildlifeController.partialUpdateOne)
                        .put(authenticationController.authenticate,hikingTrailWildlifeController.fullUpdateOne);
router.route("/search/search").get(hikingTrailController.search);

module.exports = router;    