import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [

    ConfigModule,                               // Importamos las variables de entorno

    TypeOrmModule.forFeature([User]),           // Importamos la entidad User para que la maneje TypeOrmModule           
  
  ],
  exports: [
    TypeOrmModule                               // Si alguien utiliza el authModule usará la configuración del import correspondiente
  ]
})
export class AuthModule {}
