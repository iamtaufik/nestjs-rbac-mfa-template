// core/presentation/http/dto/common/base-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<TData = any> {
  @ApiProperty({ example: 'Success create user' })
  message!: string;

  // bisa object atau array atau null
  @ApiProperty({ nullable: true })
  data!: TData | TData[] | null;
}
