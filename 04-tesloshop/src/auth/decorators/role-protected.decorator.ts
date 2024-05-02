import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'roles'

export const RoleProtected = (...args: string[]) => { // Establece los roles permitidos para una ruta através de una constante 

  return SetMetadata( META_ROLES, args );
}
