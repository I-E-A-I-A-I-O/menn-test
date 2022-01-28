import express, {Request, Response} from "express";
import {createLink} from "../controllers/links.controller";

export const LinksRouter = express.Router();

LinksRouter.post('/', createLink);
