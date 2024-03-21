import { PartialType } from '@nestjs/mapped-types'; // Permite extender un dto basado en otro dto
import { CreateBrandDto } from './create-brand.dto';

export class UpdateBrandDto extends PartialType(CreateBrandDto) { // PartialType permite que las props del dto de donde se extiende seán opcionales

}
