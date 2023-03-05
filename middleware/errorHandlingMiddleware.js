// const apiError = require('../error/apiError');
import apiError from  '../error/apiError.js'

export default function(err, req, res, next){
    if(err instanceof apiError){
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: 'Unexpected error'})
}