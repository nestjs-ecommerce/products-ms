import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { PaginationMetadataDtoParameters } from "src/common/interfaces/pagination/pagination-metadata-parameter-dto.interface";

export class PaginationMetadataDto {
    @Type(() => Number)
    @IsNumber()
    readonly page: number;

    @Type(() => Number)
    @IsNumber()
    readonly take: number;

    @Type(() => Number)
    @IsNumber()
    readonly count: number;

    @Type(() => Number)
    @IsNumber()
    readonly totalPages: number;

    constructor({
        paginationOptionsDto,
        itemCount
    }: PaginationMetadataDtoParameters) {
        this.page = paginationOptionsDto.page ?? 1;
        this.take = paginationOptionsDto.take ?? 1;
        this.count = itemCount;
        this.totalPages = Math.ceil(itemCount / (paginationOptionsDto.take ?? 1));
    }
}