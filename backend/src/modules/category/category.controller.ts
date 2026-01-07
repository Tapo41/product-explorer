import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@ApiTags('categories')
@Controller('api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('navigation/:navigationId')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get categories by navigation ID' })
  @ApiParam({ name: 'navigationId', description: 'Navigation ID' })
  @ApiQuery({ name: 'refresh', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getByNavigationId(
    @Param('navigationId') navigationId: string,
    @Query('refresh') refresh?: boolean,
  ): Promise<Category[]> {
    return await this.categoryService.getByNavigationId(navigationId, refresh === true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getById(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.getById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category found' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoryService.getBySlug(slug);
  }
}