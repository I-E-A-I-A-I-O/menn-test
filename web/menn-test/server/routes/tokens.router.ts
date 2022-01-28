import express from "express";
import {saveToken} from "../controllers/tokens.controller";

export const tokenRouter = express.Router();

tokenRouter.post('/', saveToken);
