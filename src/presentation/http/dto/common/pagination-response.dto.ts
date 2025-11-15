import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';
import { PaginatorDto } from './paginator-meta.dto';

export class PaginationResponseDto<TData = any> extends BaseResponseDto<TData> {
  @ApiProperty({
    type: () =>
      ({
        paginator: { type: () => PaginatorDto },
      }) as any,
  })
  meta!: {
    paginator: PaginatorDto;
  };
}
