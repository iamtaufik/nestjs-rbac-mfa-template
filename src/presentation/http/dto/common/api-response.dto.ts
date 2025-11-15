import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class ApiResponseDto<T> {
  @ApiProperty()
  message: string;

  data: T;
}

export const ApiResponseOf = <TModel extends Type<unknown>>(model: TModel) => {
  class ApiResponseForModel extends ApiResponseDto<TModel> {
    @ApiProperty({ type: model })
    // @ts-expect-error
    data: any;
  }

  return ApiResponseForModel;
};
