import { Router } from "express";
import { getBusinessDetails, updateBusinessDetails } from "../Controllers/BusinessDetails.Controllers.js";

const BusinessDetailsRoutes = Router();

BusinessDetailsRoutes.get("/:userId", getBusinessDetails);
BusinessDetailsRoutes.post("/:userId", updateBusinessDetails);

export default BusinessDetailsRoutes;
