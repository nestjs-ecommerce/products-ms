import { HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from 'generated/prisma';
import { PaginationOptionsDto } from 'src/common/dto/pagination/pagination-options.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';
import { ProductDto } from './dto/product.dto';
import { paginatePrisma } from 'src/common/utils/pagination.util';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private readonly prismaService: PrismaService) { }

  async create(createProductDto: CreateProductDto): Promise<ProductDto> {
    const { description, name, price } = createProductDto;

    try {
      const newProduct = await this.prismaService.
        product.create({
          data: {
            name: name,
            description: description,
            price: price,
          }
        })

      this.logger.log(`Product created: ${newProduct.id}`);

      return new ProductDto({
        createdAt: newProduct.createdAt,
        description: newProduct.description,
        id: newProduct.id, name: newProduct.name,
        price: newProduct.price,
        updatedAt: newProduct.updatedAt,
      });
    } catch (error) {
      this.logger.error('Error creating product:', error);

      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async findAll(paginationOptionsDto: PaginationOptionsDto): Promise<PaginationDto<ProductDto>> {
    try {
      return await paginatePrisma(
        this.prismaService.product,
        paginationOptionsDto,
        {},
        (product: Product) => new ProductDto(product),
      );
    } catch (error) {
      this.logger.error('Error fetching products:', error);

      throw new InternalServerErrorException('Failed to fetch products');
    }
  }

  async findOne(id: number) {
    try {
      const productFound = await this.prismaService.product.findUnique({
        where: {
          id: id,
        }
      });

      if (!productFound) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        });
      }

      return new ProductDto({
        createdAt: productFound.createdAt,
        description: productFound.description,
        id: productFound.id,
        name: productFound.name,
        price: productFound.price,
        updatedAt: productFound.updatedAt,
      });
    } catch (error) {
      this.logger.error('Error fetching product:', error);

      if (error instanceof RpcException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Failed to fetch product');
      }
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const productFound = await this.findOne(id);

      const { description, name, price } = updateProductDto;

      const updatedProduct = await this.prismaService.product.update({
        where: {
          id: productFound.id,
        },
        data: {
          name: name,
          description: description,
          price: price,
        }
      });

      this.logger.log(`Product updated: ${updatedProduct.id}`);

      return new ProductDto({
        createdAt: updatedProduct.createdAt,
        description: updatedProduct.description,
        id: updatedProduct.id,
        name: updatedProduct.name,
        price: updatedProduct.price,
        updatedAt: updatedProduct.updatedAt,
      });
    } catch (error) {
      this.logger.error('Error updating product:', error);

      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async remove(id: number) {
    try {
      const productFound = await this.findOne(id);

      const deletedProduct = await this.prismaService.product.delete({
        where: {
          id: productFound.id,
        }
      });

      this.logger.log(`Product deleted: ${deletedProduct.id}`);

      return new ProductDto({
        createdAt: deletedProduct.createdAt,
        description: deletedProduct.description,
        id: deletedProduct.id,
        name: deletedProduct.name,
        price: deletedProduct.price,
        updatedAt: deletedProduct.updatedAt,
      });
    } catch (error) {
      this.logger.error('Error deleting product:', error);

      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async validateProducts(productIds: number[]): Promise<ProductDto[]> {
    try {
      const products = await this.prismaService.product.findMany({
        where: {
          id: { in: Array.from(new Set(productIds)) },
        },
      });

      if (products.length !== productIds.length) {
        this.logger.warn('Some products not found:', productIds);

        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
          message: 'Some products not found',
        });
      }

      return products.map(product => new ProductDto(product));
    } catch (error) {
      this.logger.error('Error validating products:', error);

      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to validate products',
      });
    }
  }
}
