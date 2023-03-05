import imagemin from "imagemin";
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

import * as fs from "fs";

export default async function (req, res, next){

    let fileName;
    const files = fs.readdirSync('public\\imgs\\avatars', {
        withFileTypes: true,
    })
        files.map((file)=>{
            if(fileName) return;
            if(!file.isFile()) return;
            if (!file.name.includes(req.body.name)) return;
            fileName = file.name;
        }
        )
        const path = `public\\imgs\\avatars\\${fileName}`
        console.log(path);
        const compressedImg = await imagemin([path], {
            plugins: [
                imageminJpegtran({
                    quality:50
                }),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
        next();

}