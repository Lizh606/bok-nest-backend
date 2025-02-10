import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileDto {
  @ApiPropertyOptional({
    description: '性别：男/女',
    example: '男',
  })
  gender: string;
  @ApiProperty({
    description: '地址',
    example: '',
    required: false,
  })
  address: string;
}
