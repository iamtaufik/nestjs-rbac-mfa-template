import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export class ApiResponseDto<T> {
  @ApiProperty()
  message: string;

  // di base boleh tanpa decorator, nanti didefinisikan di subclass
  data: T;
}

export const ApiResponseOf = <TModel extends Type<unknown>>(model: TModel) => {
  class ApiResponseForModel {
    @ApiProperty()
    message: string;

    @ApiProperty({ type: model })
    // pakai any di sini supaya swagger happy
    data: any;
  }

  // Bantu swagger: kasih nama yang stabil ke class-nya
  Object.defineProperty(ApiResponseForModel, 'name', {
    value: `ApiResponseOf${model.name}`,
  });

  return ApiResponseForModel;
};
