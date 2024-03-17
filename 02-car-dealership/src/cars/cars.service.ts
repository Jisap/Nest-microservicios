import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {

  private cars = [  // Al ser private solo se podrán consumir dentro del servicio
    {
      id: 1,
      brand: 'Toyota',
      model: 'Corolla'
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'Civic'
    },
    {
      id: 1,
      brand: 'Jeep',
      model: 'Cheroka'
    },
  ]

  findAll() {
    return this.cars;
  }


  findOneById(id: number) {
    const car = this.cars.find(car => car.id === id);
    return car
  }

}
