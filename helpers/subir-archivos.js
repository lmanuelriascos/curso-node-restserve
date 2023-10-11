const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['mp4','MP4','avi','AVI','mkv','MKV','flv','FLV','mov','MOV','wmv','WMV','divx','DIVX','h.264','H.264','xvid','XVID','rm','RM','png','PNG','jpg','JPG','jpeg','JPEG','bmp','BMP','gif','GIF','tif','TIF','tiff','TIFF','pdf','PDF','doc','DOC','docx','DOCX','xls','XLS','xlsx','XLSX','txt','TXT','zip','ZIP','pptx','PPTX','pptm','PPMT','ppt','PPT'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

        const { documento } = files;
        const nombreCortado = documento.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreTemp );
      
        // limits : {filesSize: 2000000}
      

        documento.mv(uploadPath, (err) => {
            if (err) {
                reject(err); 
            }

            resolve( nombreTemp );
        });

    });

}

module.exports = {
    subirArchivo
}