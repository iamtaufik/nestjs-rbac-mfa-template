import { ApiProperty } from '@nestjs/swagger';

export class PaginatorDto {
  @ApiProperty({ nullable: true, example: 2 })
  next!: number | null;

  @ApiProperty({ nullable: true, example: null })
  prev!: number | null;

  @ApiProperty({ nullable: true, example: 10 })
  page_size!: number | null;

  @ApiProperty({ nullable: true, example: 57 })
  count!: number | null;

  @ApiProperty({ nullable: true, example: 6 })
  pages!: number | null;

  @ApiProperty({ nullable: true, example: 1 })
  current_page!: number | null;
}
