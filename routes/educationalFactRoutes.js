import { Router } from "express";
import {
  createEducationalFact,
  getEducationalFacts,
  getRecommendedEducationalFacts,
} from "../controllers/educationalFactController.js";

const router = Router();

router.post("/", createEducationalFact);   // POST /api/facts
router.get("/", getEducationalFacts);      // GET  /api/facts

// New recommendation route:
router.get("/recommend", getRecommendedEducationalFacts);


export default router;