import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
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

  async findOne(term: string) {
    
    let pokemon: Pokemon; // isNaN () implica que no es un número, luego !isNaN() implica que si es un número válido

    if (!isNaN(+term)) {                                           // Si el term es un numero entero, (!isNaN(+term)) es true
      pokemon = await this.pokemonModel.findOne({ no: term });     // Buscamos el pokemon por el no=term
    }

    if (!pokemon && isValidObjectId(term)) {                     // Si no existe un pokemon y si el term es un id de mongo 
      pokemon = await this.pokemonModel.findById(term);          // Buscamos el pokemon por el id=term
    }

    if (!pokemon) {                                                                    // Si no buscamos por un id o por un no, entonces buscamos por el nombre
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase() });   // Buscamos el pokemon por el name=term
    }

    if (!pokemon) throw new NotFoundException(`The pokemon with id, name or no = ${term} was not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term); // Utilizamos el método anteriormente creado (findOne) para buscar el pokemon por su id, name o no
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase(); // Convertimos el nombre del dto a minúsculas
    }
    
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });     // Actualizamos el pokemon con el updatePokemonDto
      return { ...pokemon.toJSON(), ...updatePokemonDto };          // Retornamos el pokemon actualizado

    } catch (error) {
      this.handleExceptions(error)
    }
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
