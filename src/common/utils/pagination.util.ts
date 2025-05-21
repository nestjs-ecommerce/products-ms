import { Prisma } from "generated/prisma";
import { PaginationMetadataDto } from "../dto/pagination/pagination-metadata.dto";
import { PaginationOptionsDto } from "../dto/pagination/pagination-options.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";

export async function paginatePrisma<T, R = T>(
  modelDelegate: {
    findMany: (args: any) => Promise<T[]>;
    count: (args?: any) => Promise<number>;
  },
  options: PaginationOptionsDto,
  findManyArgs: Prisma.ProductFindManyArgs = {},
  mapFn?: (item: T) => R,
): Promise<PaginationDto<R>> {
  const [items, total] = await Promise.all([
    modelDelegate.findMany({
      ...findManyArgs,
      skip: options.skip,
      take: options.take,
      orderBy: { createdAt: options.order },
    }),
    modelDelegate.count({ where: findManyArgs.where }),
  ]);

  const mappedItems: R[] = mapFn ? items.map(mapFn) : (items as unknown as R[]);

  const meta = new PaginationMetadataDto({
    paginationOptionsDto: options,
    itemCount: total,
  });

  return new PaginationDto<R>(mappedItems, meta);
}