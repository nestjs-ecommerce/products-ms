import { Type } from "class-transformer";
import { IsArray } from "class-validator";
import { PaginationMetadataDto } from "./pagination-metadata.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto<T> {
    @IsArray()
    @ApiProperty({
        isArray: true,
    })
    readonly data: T[];

    @ApiProperty({type: () => PaginationMetadataDto})
    readonly meta: PaginationMetadataDto;

    constructor(data: T[], meta: PaginationMetadataDto) {
        this.data = data;
        this.meta = meta;
    }
}