import express from "express";

const router = express.Router();
import cors from "cors";
import synchronizeAPSRouter from "./SynchronizeAPS.router";
import swaggerRouter from "./Swagger.router";
import branch3DRouter from "./Branch3D.router";
import circuitRouter from "./Circuit.router";
import aircraftProgramRouter from "./AircraftProgram.router";
import ImportFileRouter from "./ImportFile.router";
import componentRouter from "./Component.router";
import functionalItemRouter from "./FunctionalItem.router";
import backshell3dSolutionRouter from "./Backshell3dSolution.router";
import functionalItem3dRouter from "./functionalItem3dSolution.router";
import coveringElement3dRouter from "./CoveringElement3d.router";
import harness3dDesignSolutionRouter from "./Harness3dDesignSolution.router";
import partZoneRouter from "./PartZone.router";
import branch3dExtremitySolutionRouter from "./Branch3dExtremitySolution.router";
import wireLengthRouter from "./WireLength.router";
import AdminRouter from "./Admin.router";
import partZoneItemRouter from "./PartZoneItem.router";
import adapItemRouter from "./AdapItem.router";
import apiRouter from "./Api.router";

router.use(cors());
// CORS middleware to prepend preflight
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // intercept OPTIONS method
  if (req.method == "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

router.use("/", apiRouter);
router.use("/docs", swaggerRouter);
router.use("/file", ImportFileRouter);
router.use("/circuit", circuitRouter);
router.use("/aircraftProgram", aircraftProgramRouter);
router.use("/component", componentRouter);
router.use("/functionalItem", functionalItemRouter);
router.use("/backshell3dSolution", backshell3dSolutionRouter);
router.use("/functionalItem3dSolution", functionalItem3dRouter);
router.use("/coveringElement3d", coveringElement3dRouter);
router.use("/branch3d", branch3DRouter);
router.use("/harness3dDesignSolutions", harness3dDesignSolutionRouter);
router.use("/harness3dDesignSolution", harness3dDesignSolutionRouter);
router.use("/partZone", partZoneRouter);
router.use("/branch3dExtremitySolution", branch3dExtremitySolutionRouter);
router.use("/synchronizeAps", synchronizeAPSRouter);
router.use("/adapItem", adapItemRouter);
router.use("/partZoneItem", partZoneItemRouter);
router.use("/admin", AdminRouter);

export default router;
