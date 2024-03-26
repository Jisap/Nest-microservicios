import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { EnvConfiguration } from './config/app.config';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [

    ConfigModule.forRoot({
      load: [EnvConfiguration]                    // Permite cargar las variables de entorno
    }),

    ServeStaticModule.forRoot({                   // Permite cargar el contenido estático del html
      rootPath: join(__dirname, '..', 'public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB),  // Permite conectarse a una base de datos

    PokemonModule,                                // Carga el módulo de Pokemon
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
