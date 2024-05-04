import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../../../auth/decorators/role-protected.decorator';
import { User } from '../../../auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector // Inyectamos esta dependencia para poder extraer la metadata (roles permitidos)
  ){}

  canActivate(
    context: ExecutionContext,                                  // ctx -> contiene info sobre la solicitud una vez pasada la validación del authGuards
  ): boolean | Promise<boolean> | Observable<boolean> {         // canActivate es de tipo boolean como respuesta de la resolución de una promesa u observable

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler()) // roles permitidos para la ruta establecidos en la metadata

    if ( !validRoles ) return true;
    if ( validRoles.length === 0) return true                                         // Sino vienen los roles en la metadata se deja pasar porque la validación se estará haciendo en otro sitio. 

    const req = context.switchToHttp().getRequest();                                  // Obtenemos del contexto de la solicitud la request 
    const user = req.user as User                                                     // De la request el user 

    if(!user) throw new BadRequestException('User not found')
    
    for (const role of user.roles) {                                               // ForOf para barrer los roles permitidos para la ruta 
      if( validRoles.includes(role)){                                              // Si solo uno de los roles que tenga el user esta incluido en validRoles
        return true                                                                // se deja pasar la solicitud 
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role`
    )
  }
}
