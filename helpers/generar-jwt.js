const jwt = require('jsonwebtoken')

const generarJWT = ( uid = ' ') => {

    return new Promise( ( resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            //expiresIn: ''
        },( err, token)=>{
            if ( err ){
                console.log(err);
                reject('No se pudo generar el Token')
            }
            else{
                resolve( token )
            }
        })
    })
}


module.exports = {
    generarJWT
}