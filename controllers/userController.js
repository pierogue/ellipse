// const mongoose = require("mongoose")
import mongoose from "mongoose";
// const objectId = require("mongodb").ObjectId
import {ObjectId as objectId} from "mongodb"
// const User = require("../models/userModel");
import User from '../models/userModel.js'
// const fs = require('fs');
import fs from 'fs'
// const apiError = require('../error/apiError');
import apiError from '../error/apiError.js';

class UserController {

    async deleteAllUsers(req ,res){
        await mongoose.connect(process.env.DB_URI);

        const users = await User.find({});
        if(users){
            for(let user of users){
                await fs.unlink(`public\\imgs\\avatars\\${user.avatarImg}`,()=>{});
            }
        }
        await User.collection.drop();

        await mongoose.disconnect();
        res.send(true)
    }

    async deleteUser(req, res, next){

        const userId = req.params.id;

        await mongoose.connect(process.env.DB_URI);

        try {
            new objectId(userId);
        }
        catch(err){
            return next(apiError.badRequest('Incorrect ID'));
        }
        const user = await User.findByIdAndDelete(userId)
        if(user){
            res.sendStatus(200);
        }
        else{
            return next(apiError.badRequest('User not found'))
        }

        await fs.unlink(`public\\imgs\\avatars\\${user.avatarImg}`,()=>{});
    
        await mongoose.disconnect();
    }

    async addUser(req, res, next){

        await mongoose.connect(process.env.DB_URI)

        const name = req.body.name;
        const img = req.file;
        const password = req.body.password;
        const role = req.body.role;
        const dateOfBirth = req.body.dateOfBirth;

        const user = new User({name:name, password:password, role:role, dateOfBirth : dateOfBirth,
            avatarImg:img?img.filename:'photo707.JPG'})
        await user.save().catch((err)=>{
            fs.unlinkSync(`public\\imgs\\avatars\\${user.avatarImg}`)
            next(apiError.badRequest(err.message))
        });
        // res.redirect("/admin");
        await mongoose.disconnect();
    }

    async updateUser(req, res, next){
        await mongoose.connect(process.env.DB_URI);

        const id = req.body.id;

        const name = req.body.name;
        const img = req.file;
        const password = req.body.password;
        const role = req.body.role;
        const dateOfBirth = req.body.dateOfBirth;


        await User.findByIdAndUpdate(id, {
            name: name,
            password: password,
            role:role,
            dateOfBirth: dateOfBirth,
            avatarImg:img?img.filename:'photo707.JPG',
        }).catch((err)=>{
            fs.unlinkSync(img);
            next(apiError.badRequest('Error in updating user info'))
        });

        await mongoose.disconnect();
    }

    async getUsers(req, res){

        function hasCopies(candidate){
            for(let user of result){
                if(JSON.stringify(candidate) === JSON.stringify(user)){
                    return true;
                }
            }
            return false;
        }

        await mongoose.connect(process.env.DB_URI);

        let result = [];
        if(req.query.id || req.query.name || req.query.role) {
            const id = req.query.id;
            const name = req.query.name;
            const role = req.query.role;

                if(id){
                    // return console.log(id)
                    const userId = new objectId(id);
                    const user = await User.findOne({_id:userId})
                    if(user && !hasCopies(user)) {
                        result.push(user);
                    }
                }
                else if(name){
                    const users = await User.find({name:name});
                    for(let user of users){
                        if(user && !hasCopies(user)){
                            result.push(user)
                        }
                    }
                }
                else if(role){
                    const users = await User.find({role:role});
                    for(let user of users){
                        if(!hasCopies(user)){
                            result.push(user)
                        }
                    }
                }
            }
            else{
                const users = await User.find({});
                for(let user of users){
                    result.push(user)
                }
            }
            res.send(result);

            await mongoose.disconnect()
    }
}

export default new UserController()