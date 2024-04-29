import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [
    ConfigModule  // Importamos este módulo para cargar la envs desde el configService
  ]
})
export class FilesModule {}
