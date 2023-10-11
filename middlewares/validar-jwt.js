const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const validarJWT = (req = request, res = response, next) => {

    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            status: 401,
            msg: 'No hay Token en la peticion',
            data: ''
        });        
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        req.uid = uid;
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            status: 401,
            msg: 'Token no Valido',
            data: ''
        })
    }

    

}


module.exports = {
    validarJWT,
}