import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    PokemonModule,  // Para realizar inserciones en bd con moongose 
    CommonModule    // Para poder hacer peticiones con el patron adaptador httpAdapter
  ]
})
export class SeedModule {}
