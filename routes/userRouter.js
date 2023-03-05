// const Router = require("express");
import Router from 'express'
const userRouter = new Router();

// const userController = require("../controllers/userController")
import userController from '../controllers/userController.js'

// const bodyParser = require("body-parser");
import bodyParser from 'body-parser'
// const multer = require('multer');
import multer from 'multer'
// const imgMinifier = require('../middleware/imgMinifyMiddleware')
import imgMinifier from '../middleware/imgMinifyMiddleware.js'
const urlencodedParser = bodyParser.urlencoded({extended: true});

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "public/imgs/avatars");
    },
    filename: (req, file, cb) =>{
        console.log(req.body.name)
        cb(null, setFileName(req, file));
    }
});

function setFileName(req, file) {
    let extension = file.originalname.split('.')
    extension = extension[extension.length - 1]
    const name = req.body.name
    return `${name}.${extension}`
}

userRouter.use(multer({storage:storageConfig}).single("filedata"));


userRouter.get("/", userController.getUsers);

userRouter.post("/", urlencodedParser, imgMinifier, userController.addUser);

userRouter.put("/", urlencodedParser, userController.updateUser)

userRouter.delete("/", userController.deleteAllUsers)

userRouter.delete("/:id", userController.deleteUser)


export default userRouter