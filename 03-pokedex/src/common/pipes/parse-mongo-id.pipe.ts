import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {  // Clase que transforma datos usando la interfaz PipeTransform

  transform(value: string, metadata: ArgumentMetadata): string {  // Transform recibe el valor a transformar y info adicional sobre el value

    if (!isValidObjectId(value)) {  // Se comprueba que el value es in mongoId válido
      throw new BadRequestException(`The value ${value} is not a valid mongo id`);
    }

    return value.toUpperCase(); // Si es un mongoId válido se transforma a mayúsculas.
  }
}
