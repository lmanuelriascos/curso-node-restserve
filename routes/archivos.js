const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarAchivoSubir } = require('../middlewares/validar-archivo');


const { 
        ListararchivosPorusuario,
        Listararchivos,
        actualizardocumento,
        archivosPost,
        archivosDelete,
        archivoPost,
        BuscarArchivoporNombrePost,
        BuscarArchivoporProyectoPost,
        BuscarArchivoporDescripcionPost,
        archivosporNombrePost,
        ArchivosrangoFechaPost,
        ArchivosporFechaPost,
        ArchivosrangoActualizadoPost,
        ListarporextencionPost,
        archivosProyectoDelete,
        imagenArchivo,
        borrarArchivos
    } = require('../controllers/archivos');

   
// const { validarJWT } = require('../middlewares/validar-jwt');

const router = new Router();

router.post('/ListararchivosPorusuario',[
    // validarJWT

],ListararchivosPorusuario)

// Listar todos los archivos
router.post('/Listararchivos',[
    // validarJWT

],Listararchivos)

//Buscar archivo por Id
router.post('/:id',[
    // validarJWT
], archivoPost)

// Buscar archivo por Nombre
router.post('/BuscarArchivoporNombre/:documentacion',[
    // validarJWT
],  BuscarArchivoporNombrePost)

// Buscar archivos por descripcion
router.post('/BuscarArchivoporDescripcion/:descripcion',[
    // validarJWT
],  BuscarArchivoporDescripcionPost)

//Buscar archivos por similitud de nombres
router.post('/archivosporNombre/:documentacion',[
    // validarJWT

],  archivosporNombrePost)

// Buscar Archivos por rango de fecha 
router.post('/ArchivosrangoFecha/:fecha_inicio/:fecha_fin',[
    // validarJWT
],  ArchivosrangoFechaPost)

// Buscar archivos por fecha de creacion
router.post('/ArchivosporFecha/:createdAt', [
    // validarJWT
], ArchivosporFechaPost)

// Bucar archivos por fecha de actualizacion
router.post('/ArchivosrangoActualizado/:updatedAt', [
    // validarJWT
], ArchivosrangoActualizadoPost)

//Listar archivos por tipo de extencion 
router.post('/Listarporextencion/:documento',[
    // validarJWT
],  ListarporextencionPost)

// Buscar archivos por Id de proyecto
router.post('/BuscarArchivoporProyecto/:uuidproyecto',[
    // validarJWT
],  BuscarArchivoporProyectoPost)

// Actualizar archivos 
router.put('/actualizardocumento/:id', [
    // validarJWT,
    check('id','El id debe de ser de mongo').isMongoId(),
    validarCampos
    ],actualizardocumento)

router.post('/',[
    // validarJWT,
    validarAchivoSubir

],archivosPost )

//Borrar un archivo
router.delete('/:id',[
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    
] ,archivosDelete)

// borrar todos los archivos de un proyecto
router.delete('/archivosProyecto/:id',[
    //validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
] ,archivosProyectoDelete);

router.get('/documento/:id',imagenArchivo);

//Borrar un archivo
router.delete('/borrarArchivos/:id',[
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
] ,borrarArchivos)

module.exports = router;