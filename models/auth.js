const { Schema, model } = require('mongoose');

const TokenSchema = Schema({
    id_usuario: {
        type: String,
        required: [true, 'el Codigo de usuario es Obligatorio']
    },
    token: {
        type: String,
        required: [true, 'el token es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now
    }
}, { timestamps: {} });

TokenSchema.methods.toJSON = function () {
    const {__v, _id,  ...token } = this.toObject();
    token.uid_token = _id;
    return token;
} 


module.exports = model('Token', TokenSchema)