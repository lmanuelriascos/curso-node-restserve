const path = require('path');
const fsp   = require('fs').promises;
const fs   = require('fs');
const { response,request } = require('express');
const { subirArchivo } = require('../helpers/subir-archivos');
const Auth = require('../models/auth');
const str_replacer = require('str_replace');


const Archivo = require('../models/archivo');


// Listar archivos por usuario
const ListararchivosPorusuario = async(req = request, res = response) => {
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const archivos = await Archivo.find({uuidusuario: uid})

        res.status(200).json({
                
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivos
        });
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }

}

// Listar todos los proyectos

const Listararchivos = async(req = request, res = response) => {
    try {

        const uid = req.uid;

        const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const archivos = await Archivo.find()

        res.status(200).json({
                
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivos
        });
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }

} 

// Subir archivo
const archivosPost = async(req = request, res = response) => {
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }
        const uuidusuario = uid;
        
        const {documentacion, descripcion, documento} = req.body
        const nombre = await subirArchivo( req.files, undefined, 'documentacion');
        const archivo = new Archivo({
            documentacion,
            descripcion,
            uuidusuario,
            documento:nombre
        })
        
        //    console.log(req.files);
        
        
        await archivo.save()

         

        res.status(200).json({
            
            status: 200,
            msg: "Archivo subido con exito!",
            data: {
                    documentacion:archivo.documentacion,
                    descripcion:archivo.descripcion,
                    uuidusuario:archivo.uuidusuario,
                    documento:archivo.documento
            
                }

            
        })
        console.log(archivo);
       
        
    } catch (msg) {
        // console.log(msg);
        res.status(400).json({ msg });
        
    }

}

// Actualizar Archivo
const actualizardocumento = async(req, res = response ) => {

    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }
        const { id } = req.params;
    
        const modelo = await Archivo.findById(id);
       
        const {documentacion, descripcion, documento} = req.body

        

        if( req.files){
            const documentos =path.join('./uploads/documentacion/'+ modelo.documento);
            if (fs.existsSync(documentos)) {
                fsp.unlink(documentos);
            }
            const nombre = await subirArchivo( req.files, undefined, 'documentacion');
            const archivo = await Archivo.findByIdAndUpdate( id, {documentacion, descripcion, uuidusuario:uid, documento:nombre} );
        }
        else{
            const archivo = await Archivo.findByIdAndUpdate( id, {documentacion, descripcion, uuidusuario:uid} );
        }

       
        res.status(200).json({
            status: 200,
            msg: "Archivo Actualizando con exito!",
            data: modelo
            
        }) 
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    }
        

   
}
    
// Borrar Archivo
const archivosDelete = async(req = request, res = response) => {
 
    try {

        const uid = req.uid;

        const token = req.header('x-token');

        const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        if( !token_autenticacion ){
            return res.status(200).json({
                status: 400,
                msg: 'Token no Valido!!',
                data: ''
            })
        }

        const archivo = await
        Archivo.findByIdAndDelete(req.params.id);

        
        const archivoeliminar = await fs.unlink('./uploads/documentacion/'+archivo.documento); 


        res.status(200).json({
                
            status: 200,
            msg: "Archivo borrado con Exito!",
            data: archivo
        });
        
    } catch (error) {
        
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }

}

// Borrar Todos Los Archivos de un proyecto
const archivosProyectoDelete = async(req = request, res = response) => {
 
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }
        const archivos = await Archivo.find({uuidproyecto: req.params.id});
        let msg = '';
        if(archivos.length > 0){
            archivos.forEach( async (key)  =>{
                let codigo_archivo = key.id;
                let nombre_archivo = key.documento;
                
                let datos_archivo = await Archivo.findByIdAndDelete(codigo_archivo);
                let archivoeliminar = await fs.unlink('./uploads/documentacion/'+nombre_archivo); 
                
            });
            msg = 'Archivos eliminados con exito !'

        }
        else{
            msg = 'No hay archivos por el proyecto'
        }
        

        res.status(200).json({
                
            status: 200,
            msg: msg,
            data: archivos
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }

}

// Consultar_archivo_por_id
const archivoPost = async(req = request, res = response) => {
 
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const archivo = await
        Archivo.findById(req.params.id) 


        res.status(200).json({
                
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    }
}

// Buscar Archivo por Nombre
const BuscarArchivoporNombrePost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const documentacion = req.params.documentacion
        const archivo = await
        Archivo.findOne({documentacion:{ $regex: documentacion, $options:'i' } }) 


        res.status(200).json({
                
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }
}

// Buscar Archivo por Descripcion
const BuscarArchivoporDescripcionPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const descripcion = req.params.descripcion
        const archivo = await
        Archivo.find({descripcion:{ $regex: descripcion, $options:'i' } }) 

        res.status(200).json({
                
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
        
    } catch (error) {

        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    }
}

// Buscar Archivos por Similitud
const archivosporNombrePost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const documentacion = req.params.documentacion
        const archivo = await 

        Archivo.find({documentacion:{ $regex: documentacion, $options:'i' } })
        res.status(200).json({
                    
            status: 200,
            msg: "Archivos encontrados!",
            data: archivo
        });
    
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    }
}

   // Archivos por rango de Fecha
const ArchivosrangoFechaPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const fecha_inicio = req.params.fecha_inicio+"T00:00:00.000+00:00";
        const fecha_fin = req.params.fecha_fin+"T23:59:59.000+00:00";
       

        
        const archivo = await 
        Archivo.find({$and: [{createdAt: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) } },{updateAt: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) } } ]})
        
        res.status(200).json({
                    
            status: 200,
            msg: "Archivos encontrados!",
            data: archivo
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }

}

// Archivos por rango Actualizado
const ArchivosrangoActualizadoPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }
        const updatedAt = req.params.updatedAt
        const fecha_inicio = updatedAt+"T00:00:00.000+00:00";
        const fecha_fin = updatedAt+"T23:59:59.000+00:00";
        const archivo = await 
    
        
        
        Archivo.find({updatedAt: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) } })
        res.status(200).json({
                    
            status: 200,
            msg: "Archivos encontrados!",
            data: archivo
        });
    
        
    } catch (error) {

        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }
    
   

}

// Archivos con Fecha exacta
const ArchivosporFechaPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }
        const createdAt = req.params.createdAt
        const fecha_inicio = createdAt+"T00:00:00.000+00:00";
        const fecha_fin = createdAt+"T23:59:59.000+00:00";
    
        const archivo = await 
        
        Archivo.find({createdAt: { $gte: new Date(fecha_inicio), $lte: new Date(fecha_fin) } })
        res.status(200).json({
                    
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
       
      
         } catch (error) {
            res.status(500).json({
                status: 500,
                msg: "Error en la solicitud!",
                data: '',
            }) 
        
    }
   

    
   

}
//  Listar archivos por extension
const ListarporextencionPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const documento = req.params.documento
        const archivo = await 
        Archivo.find({documento:{ $regex: documento, $options:'i' } })

        res.status(200).json({
                    
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
    
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
        
    }
    
   

}

// Buscar Archivo por id Proyecto
const BuscarArchivoporProyectoPost = async(req = request, res = response) => {
    
    try {

        const uid = req.uid;

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

        const uuidproyecto = req.params.uuidproyecto
        const archivo = await 

    
        Archivo.find({uuidproyecto})
        res.status(200).json({
                        
            status: 200,
            msg: "Proceso Exitoso!",
            data: archivo
        });
    
    } catch (error) {

        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    }
}

const imagenArchivo = async(req = request, res = response) => {
    try {
        const archivo = await Archivo.findById(req.params.id);

        let ubicacion = __dirname;
        
        const url = str_replacer('controllers','',ubicacion);

        let copia_mostrar = '';

        if(archivo){
            const documento = archivo.documento;

            
    
            if(documento){
                const copia =path.join('./uploads/documentacion/'+documento);
                if (fs.existsSync(copia)) {
                    copia_mostrar = documento;
                    res.writeHead(200);
                    fs.createReadStream(url+'uploads/documentacion/'+copia_mostrar).pipe(res);
        
                }
                else{
                    res.status(404).json({msg:'Archivo no encontrado'})
                    
                }              
             
            }
            else{
                res.status(404).json({msg:'Archivo no encontrado'})
            } 

        }
        else{
            res.status(404).json({msg:'Archivo no encontrado'})
        }
       

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: error,
        }) 
        
    }
   

}

const borrarArchivos =  async(req, res = response) => {
    try{
        const uid = req.uid;

        console.log(uid);

        // const token = req.header('x-token');

        // const token_autenticacion = await Auth.findOne({ token,  id_usuario: uid});

        // if( !token_autenticacion ){
        //     return res.status(200).json({
        //         status: 400,
        //         msg: 'Token no Valido!!',
        //         data: ''
        //     })
        // }

     const { id } = req.params;
     const archivo = await Archivo.findByIdAndDelete( id );
    
        res.status(200).json({
            status: 200,
            msg: "Archivo borrado",
            data: archivo
        });
    }catch (error) {
        res.status(500).json({
            status: 500,
            msg: "Error en la solicitud!",
            data: '',
        }) 
    } 
}


module.exports = {
    ListararchivosPorusuario,
    Listararchivos,
    actualizardocumento,
    archivosPost,
    subirArchivo,
    archivosDelete,
    archivoPost,
    BuscarArchivoporNombrePost,
    BuscarArchivoporDescripcionPost,
    BuscarArchivoporProyectoPost,
    archivosporNombrePost,
    ArchivosrangoFechaPost,
    ArchivosporFechaPost,
    ArchivosrangoActualizadoPost,
    ListarporextencionPost,
    archivosProyectoDelete,
    imagenArchivo,
    borrarArchivos
   
}
