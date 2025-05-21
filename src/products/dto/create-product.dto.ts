import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    @IsString()
    @IsOptional()
    @MinLength(10)
    @MaxLength(200)
    description: string;

    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @IsNotEmpty()
    @Max(1000000)
    price: number;
}
