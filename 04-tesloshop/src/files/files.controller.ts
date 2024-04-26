import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';




@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService                    // Variables de entorno
  ) {}

  @Get('product/:imageName')                                         // Función para obtener la imagen de un pto desde el nombre (uuid)
  findProductImage(                                                  // Para ello usa esta función que utiliza
    @Res() res: Response,                                            // @Res rompe el control de nest con la respuesta para hacerla manual nosotros mismos
    @Param('imageName') imageName: string                            // y @Params para obtener de los params de la url la 'imageName' (uuid)
  ) {

    const path = this.filesService.getStaticProductImage(imageName); // con ese imageName y usando una función del filesService se obtiene el path

    return res.sendFile(path);                                       // Devolvemos el archivo según ese path  
  }

  @Post('product')                                                    // Petición post a api/files/product para subida de un archivo
  @UseInterceptors(FileInterceptor('file', {                          // Interceptamos la petición de subida de archivos para modificar la respuesta sobre el archivo 'file'
    fileFilter: fileFilter,                                           // fileFilter recibe el file y evalua si tiene extensión permitida y si no se seleccion nada como file                                              
    storage: diskStorage({                                            // Si la extensión es permitida se procede a su almacenaj
      destination: './static/products',                               // en la carpeta '/static/products' 
      filename: fileNamer                                             // y su renombre del archivo con uuid
    })
  }))
  uploadProductImage(                                                 // Esta función recibe el file validado por extensión, renombrado por uuid y almacenado en fs
    @UploadedFile()                                                   // Este decorador recibe el archivo subido y permite obtener su metadata
    file:Express.Multer.File
  ){
    if (!file) {                                                              // Si se recibio un false del fileFilter por extensión no aceptada 
      throw new BadRequestException('Make sure that the file is an image')    // mensaje de error
    }

    //console.log({ file });
    // file: {
    //   fieldname: 'file',
    //    originalname: 'careto-prueba.jpg',
    //    encoding: '7bit',
    //    mimetype: 'image/jpeg',
    //    destination: './static/products',
    //    filename: '8c548ee6-1f3e-46bd-9a60-f8548e29ed14.jpeg',
    //    path: 'static\\products\\8c548ee6-1f3e-46bd-9a60-f8548e29ed14.jpeg',
    //    size: 46329
    // }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename} }`; 
  
    return {
      secureUrl
    } 
  }

}
