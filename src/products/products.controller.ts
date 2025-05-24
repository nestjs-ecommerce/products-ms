import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationOptionsDto } from 'src/common/dto/pagination/pagination-options.dto';
import { ProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({
    cmd: 'create_product',
  })
  create(@Payload() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({
    cmd: 'find_all_products',
  })
  findAll(
    @Payload() paginationOptionsDto: PaginationOptionsDto,
  ): Promise<PaginationDto<ProductDto>> {
    return this.productsService.findAll(paginationOptionsDto);
  }

  @MessagePattern({
    cmd: 'find_one_product',
  })
  findOne(@Payload('id') id: number): Promise<ProductDto> {
    return this.productsService.findOne(id);
  }

  @MessagePattern({
    cmd: 'update_product',
  })
  update(@Payload('id') id: number, @Payload() updateProductDto: UpdateProductDto): Promise<ProductDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @MessagePattern({
    cmd: 'remove_product',
  })
  remove(@Payload('id') id: number): Promise<ProductDto> {
    return this.productsService.remove(id);
  }

  @MessagePattern({
    cmd: 'validate_products',
  })
  validate(@Payload() productIds: number[]): Promise<ProductDto[]> {
    return this.productsService.validateProducts(productIds);
  }
}
