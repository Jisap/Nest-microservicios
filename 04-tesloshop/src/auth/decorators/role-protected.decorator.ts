import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interface/valid-roles';

export const META_ROLES = 'roles'

export const RoleProtected = (...args: ValidRoles[]) => { // Establece los roles permitidos para una ruta através de una constante 

  return SetMetadata( META_ROLES, args );
}
