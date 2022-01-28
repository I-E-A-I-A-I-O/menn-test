import express from "express";
import {getNames, insertName} from "../controllers/names.controller";

export const namesRouter = express.Router();

namesRouter.get('/', getNames);
namesRouter.post('/', insertName);
