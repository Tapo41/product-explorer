import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@ApiTags('products')
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('category/:categoryId')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get products by category ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'refresh', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getByCategoryId(
    @Param('categoryId') categoryId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 24,
    @Query('refresh') refresh?: boolean,
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    return await this.productService.getByCategoryId(
      categoryId,
      Number(page),
      Number(limit),
      refresh === true,
    );
  }

  @Get('search')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 24,
  ): Promise<{ products: Product[]; total: number }> {
    return await this.productService.search(query, Number(page), Number(limit));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiQuery({ name: 'refresh', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getById(
    @Param('id') id: string,
    @Query('refresh') refresh?: boolean,
  ): Promise<Product> {
    return await this.productService.getById(id, refresh === true);
  }

  @Get(':id/recommended')
  @ApiOperation({ summary: 'Get recommended products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Recommended products retrieved successfully' })
  async getRecommended(
    @Param('id') id: string,
    @Query('limit') limit = 6,
  ): Promise<Product[]> {
    return await this.productService.getRecommended(id, Number(limit));
  }
}