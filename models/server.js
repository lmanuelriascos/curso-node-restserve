const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.archivosPath = '/api/archivos'


        // Conectar a base de datos
        this.conectarDB();


        //Middlewares
        this.middlewares();


        //Rutas de mi aplicacion

        this.routes();
    
    }

    async conectarDB() {
        await dbConnection();

    }

    middlewares() {

        //CORS
        this.app.use( cors() );

        //Parseo y lectura del body
        this.app.use( express.json() );

        //Directorio Público

        this.app.use( express.static('public') );
    }

    routes() {
        
        this.app.use( this.usuariosPath, require('../routes/usuarios'));
        this.app.use(this.archivosPath, require('../routes/archivos'))
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
          });
    }



}




module.exports = Server;