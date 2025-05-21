import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsDecimal, IsInt, IsOptional, IsPositive, IsString } from "class-validator";
import { Product } from "generated/prisma";

export class ProductDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description?: string;

  @Type(() => Number)
  @IsDecimal({
    decimal_digits: "0,2",
    force_decimal: false,
  })
  @IsPositive()
  price: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.description = product.description ?? undefined;
    this.price = product.price;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}