import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { PaginationOrder } from "src/common/enums/pagination/pagination-order.enum";

export class PaginationOptionsDto {
    @IsOptional()
    @IsEnum(PaginationOrder)
    readonly order?: PaginationOrder = PaginationOrder.ASC;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    readonly take?: number = 10;

    get skip(): number {
        const page = this.page ?? 1;
        const take = this.take ?? 10;
        return (page - 1) * take;
    }
}