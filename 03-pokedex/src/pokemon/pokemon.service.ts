import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name.toLowerCase();           // El name del dto lo grabaremos en bd en minúsculas.
  
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);    // Creamos el pokemon en la base de datos usando el modelo de mongoose
      return pokemon;                                                      // Retornamos el pokemon creado.
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {                                           // Si el error es de tipo 11000, entonces el pokemon ya existe
      throw new BadRequestException(`The pokemon already exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);                                                   // Si el error es de otro tipo, entonces mostramos el error   
    throw new InternalServerErrorException(`The pokemon could not be created - Check server logs`);
  }
}
