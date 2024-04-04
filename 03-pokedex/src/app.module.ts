import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { EnvConfiguration } from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { JoiValidationSchema } from './config/joi.validation';


@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfiguration],                   // Permite cargar las variables de entorno
      validationSchema: JoiValidationSchema       // Validación de los datos de las variables de entorno usando joi
    }),

    ServeStaticModule.forRoot({                   // Permite cargar el contenido estático del html
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB),  // Permite conectarse a una base de datos

    PokemonModule, CommonModule, SeedModule,      // Carga el módulo de Pokemon, el commonModule y el seedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
