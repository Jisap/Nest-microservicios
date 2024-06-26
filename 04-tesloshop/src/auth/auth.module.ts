import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [

    ConfigModule,                                         // Importamos las variables de entorno

    TypeOrmModule.forFeature([User]),                     // Importamos la entidad User para que la maneje TypeOrmModule           
  
    PassportModule.register({ defaultStrategy: 'jwt' }),  // Permite autenticar las credenciales siguiendo una estrategia ( verificación por jwt con JwtStrategy )
  
    JwtModule.registerAsync({                             // Permite la generación de un Jwt atendiendo a una configuración. Es async para poder cargar las .env 
      imports: [ConfigModule],                            // Importamos el ConfigModule para porder usar la variables de entorno en este modulo y
      inject: [ConfigService],                            // para poder hacerlo necesitamos usar el ConfigService el cual se inyecta en este módulo.
      useFactory: (configService: ConfigService) => {     // La inyección necesita el useFactory() 
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' }
        }
      }
    })

  ],
  exports: [
    TypeOrmModule,                                        // Si alguien utiliza el authModule usará la configuración del import correspondiente
    PassportModule,
    JwtModule,
    JwtStrategy,
  ]
})
export class AuthModule {}
