import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {

  private cars: Car[] = [  // Al ser private solo se podrán consumir dentro del servicio
    // {
    //   id: uuid(),
    //   brand: 'Toyota',
    //   model: 'Corolla'
    // },
  ]

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find(car => car.id === id);
    if( !car ) throw new NotFoundException(`Car with '${id}' not found`); 
    return car
  }

  create( createCarDto: CreateCarDto){
    const car:Car = {
      id: uuid(),
      ...createCarDto
    }
    this.cars.push(car)

    return car
  }

  update(id: string, updateCarDto: UpdateCarDto) {

    let carDB = this.findOneById(id);                                   // referencia al automóvil en la base de datos 

    if (updateCarDto.id && updateCarDto.id !== id)                      // Se verifica si el campo id dentro de updateCarDto existe y si es diferente del id proporcionado en la función
      throw new BadRequestException(`Car id is not valid inside body`);

    this.cars = this.cars.map(car => {

      if (car.id === id) {                                              // Se verifica si el id del automóvil en bd coincide con el id proporcionado.
        carDB = {                                                       // Si coinciden, se actualiza el objeto carDB                           
          ...carDB,         // props del car en bd
          ...updateCarDto,  // props actualizadas
          id                // id del car a actualizar  
        }                       
        return carDB;
      }

      return car;                                                       // Si el id no coincide, el automóvil se devuelve sin cambios.
    })

    return carDB; // Finalmente, la función devuelve el objeto carDB, que representa el automóvil actualizado en la base de datos.
  }

  delete(id: string) {
    const car = this.findOneById(id);
    this.cars = this.cars.filter(car => car.id !== id);
  }

  fillCarsWithSeedData(cars: Car[]) {
    this.cars = cars;
  }

}
