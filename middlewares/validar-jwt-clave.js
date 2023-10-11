const { request, response } = require('express')
const jwt = require('jsonwebtoken')

const validarJWTClave= (req = request, res = response, next) => {

    
    const token = req.header('reset');

    if(!token) {
        return res.status(401).json({
            status: 401,
            msg: 'No hay Token en la peticion',
            data: ''
        });        
    }

    try {

        const { usuarioId, correo } = jwt.verify( token, process.env.SECRETORPRIVATEKEYRESTAURAR);

        req.usuarioId = usuarioId;
        req.correo = correo;
        
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
    validarJWTClave,
}