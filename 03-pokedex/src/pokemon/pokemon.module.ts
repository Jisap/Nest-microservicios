import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([               // forFeature nos permite importar el schema de mongoose
      {
        name: Pokemon.name,                   // name: nombre de la entidad
        schema: PokemonSchema                 // schema: esquema de mongoose
      }
    ])
  ],
  exports: [
    MongooseModule                            // Exportamos el módulo de mongoose con la configuración del pokemon.module 
  ]                                           // para que se pueda usar en otros módulos.
})
export class PokemonModule {}
