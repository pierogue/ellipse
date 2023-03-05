// require('dotenv').config()
import dotenv from 'dotenv'
dotenv.config();

// const express = require("express");
import express from 'express'
const app = express();

// const router = require("./routes/index");
import router from './routes/index.js'
const PORT = process.env.PORT || 3000;

// const errMiddleware = require('./middleware/errorHandlingMiddleware')
import errMiddleware from './middleware/errorHandlingMiddleware.js'

//ВКЛЮЧАЕМ ПАГ
app.set("view engine", "pug");

//ПОДРУБАЕМ КАТАЛОГ С ШАБЛОНАМИ
app.set("views", "./views")

//ПОДРУБАЕМ СТАТИКУ
app.use("/admin", express.static("public"));

//ПОДКЛЮЧАЕМ НАШ ЭЙПИАЙ
app.use("/api", router);

app.use(errMiddleware);

//ТУТ ЧИСТО ПРОБУЮ ПАГ КАК РАБОТЕТ, ВПРИНЦИПЕ ПРИКОЛЬНО )))
app.get("/", (req, res)=>{
    res.render("index",{title:"ADMIN", header:"hello", arr:[{id:1, name:'vasya'},{id:2,name:'alex'}, {id:3, name:'sanya'}]})
})


//САМО СОБОЙ НАЧИНАЕМ ПРОСЛУШИВАТЬ
app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`);
})
