const { Schema, model } = require('mongoose');

const ArchivoSchema = Schema({
    documento: {
        type: String,
        require: [true, 'el nombre es obligatorio']
    },
    documentacion: {
        type: String,
        // required: [true, 'la documentación es obligatorio']
    },
    descripcion: {
        type: String,
        require: true,
    },
    uuidusuario: {
        type: String,
        require: true,
    },    
}, {
    timestamps: true
});

ArchivoSchema.methods.toJSON = function () {
    const {__v,  ...archivo } = this.toObject();
    //proyecto.uid = _id;
    return archivo;
} 


module.exports = model('Archivo', ArchivoSchema)