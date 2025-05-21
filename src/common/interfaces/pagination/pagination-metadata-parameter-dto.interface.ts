import { PaginationOptionsDto } from "src/common/dto/pagination/pagination-options.dto";

export interface PaginationMetadataDtoParameters {
    paginationOptionsDto: PaginationOptionsDto;
    itemCount: number;  
}