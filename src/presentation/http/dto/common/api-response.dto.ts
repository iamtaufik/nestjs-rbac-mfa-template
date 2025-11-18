import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class ApiResponseDto<T> {
  @ApiProperty()
  message: string;

  data: T;
}

export const ApiResponseOf = <TModel extends Type<unknown>>(model: TModel) => {
  class ApiResponseForModel {
    @ApiProperty()
    message: string;

    @ApiProperty({ type: model })
    data: any;
  }

  Object.defineProperty(ApiResponseForModel, 'name', {
    value: `ApiResponseOf${model.name}`,
  });

  return ApiResponseForModel;
};
