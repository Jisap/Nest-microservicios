import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/fileNamer.helpers';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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

    return {
      filename: file.originalname

    }
  }
}
