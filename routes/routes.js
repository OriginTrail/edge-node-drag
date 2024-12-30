import express from "express";

import { validateRequestParams } from "../middleware/validate.js";

import exampleController from "../controllers/exampleSparqlController.js";
import exampleVectorController from "../controllers/exampleVectorController.js";
import controller from "../controllers/controller.js";

const router = express.Router();

//if you create a new controller add it here

router.post(
  "/server/api/example",
  validateRequestParams,
  exampleController.ask
);

router.post(
  "/server/api/example-vector",
  validateRequestParams,
  exampleVectorController.ask
);

router.post("/server/api/ask", validateRequestParams, controller.ask);

export default router;
