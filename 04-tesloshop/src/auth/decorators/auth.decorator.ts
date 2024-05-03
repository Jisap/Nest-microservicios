import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { ValidRoles } from '../interface/valid-roles';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    RoleProtected(...roles),                      // Asignamos al campo roles los valores permitidos en ValidRoles[]
    UseGuards(AuthGuard(), UserRoleGuard),        // validate de JWTStrategy + comprobación del rol que tiene el user = a los permitidos
  );
}

// Si Auth(ValidRoles.superUser) esta ruta solo se podría acceder con ese role