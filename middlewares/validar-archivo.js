const { response } = require("express")

const validarAchivoSubir = (req, res = response, next ) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.documento) {
        return res.status(400).json({
            msg:'No hay archivos para subir - validarArchivoSubir'
        });
        
      }

      next();
  
}



module.exports = {
    validarAchivoSubir
}