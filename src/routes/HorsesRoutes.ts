import express from "express";
import horsesController from "../controllers/HorsesController";
import ownersController from "../controllers/OwnersController";

const router = express.Router();

router.get("/openapi", horsesController.openApi);

//Get all horses
router.get("/horses", horsesController.getAllHorses);
//Get horse by ID
router.get("/horses/:id", horsesController.getHorse);

//Get all owners
router.get("/owners", ownersController.getAllOwners);
//Get owner by ID
router.get("/owners/:id", ownersController.getOwner);
//Get all horses from one owner by ID(owners)
router.get("/owners-horses/:id", ownersController.getOwnersHorses);

//Add a new owner
router.post("/owners", ownersController.addOwner);

//Update existing owner
router.put("/owners/:id", ownersController.updateOwner);

//Delete specific horse
router.delete("/horses/:id", horsesController.deleteHorse);

export = router;
