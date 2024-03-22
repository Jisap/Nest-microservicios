import { Car } from "src/cars/interfaces/car.interface";
import { v4 as uuid } from 'uuid';


export const CARS_SEED: Car[] = [ // Se pueden importar las interfaces sino habría que declararlas en los modulos
  {
    id: uuid(),
    brand: 'Toyota',
    model: 'Corolla',
  },
  {
    id: uuid(),
    brand: 'Honda',
    model: 'Civic',
  },
  {
    id: uuid(),
    brand: 'Jeep',
    model: 'Cherokee',
  },
]