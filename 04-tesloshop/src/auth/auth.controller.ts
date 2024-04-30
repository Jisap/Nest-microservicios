import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') //api/auth/register
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())                             // Determinan si una solicitud dada será manejada por el controlador de ruta o no, dependiendo de las condiciones del jwtStrategy
                                                      // jwtStrategy determina si el payload de esta ruta se corresponde con un usuario de la bd registrado
  testingPrivateRoute(){

    return {
      ok: true,
      message: 'hola mundo private'
    }
  }
}
