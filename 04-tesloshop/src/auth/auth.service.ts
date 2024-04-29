import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)                                 // El módulo AuthService trabaja con instancias del modelo User
    private readonly userRepository: Repository<User>       // Las instancias son los userRepository basadas en la entity User
  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;          // Extraemos del dto la password
      const user = this.userRepository.create({
        ...userData,                                            // El dto se compondrá de los datos del usuario
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save( user );
      delete user.password;
      return {
        ...user
      }

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;                                   // email y pass del dto
    const user = await this.userRepository.findOne({                            // Buscamos el user en las instancias de usuarios en bd
      where: { email },                                                         // la condición es que el email debe ser el que se proporciono en el dto
      select: { email: true, password: true, id: true }                         // y mostramos el email y password y el id ( por defecto pass e id no se mostraba )
    });

    if (!user)                                                                  // Si el usuario no existe en bd
      throw new UnauthorizedException('Credentials are not valid (email)')      // mensaje de error

    if (!bcrypt.compareSync(password, user.password))                           // Si el usuario si existe pero la pass no coincide con la de la bd
      throw new UnauthorizedException('Credentials are not valid (password)')   // mensaje de error

    return {
      ...user
    }
  }

  private handleDBErrors(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('PLease check server logs')
  }

  
}
