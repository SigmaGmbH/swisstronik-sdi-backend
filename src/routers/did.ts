import express  from "express";
import {create, list} from "../views/did";

const router = express.Router();
router.post("/create", create);
router.get("/list", list);


export {router};
