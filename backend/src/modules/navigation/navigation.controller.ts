import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { NavigationService } from './navigation.service';
import { Navigation } from './navigation.entity';

@ApiTags('navigation')
@Controller('api/navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all navigation items' })
  @ApiQuery({ name: 'refresh', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Navigation items retrieved successfully' })
  async getAll(@Query('refresh') refresh?: boolean): Promise<Navigation[]> {
    return await this.navigationService.getAll(refresh === true);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get navigation item by ID' })
  @ApiResponse({ status: 200, description: 'Navigation item found' })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async getById(@Param('id') id: string): Promise<Navigation> {
    return await this.navigationService.getById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get navigation item by slug' })
  @ApiResponse({ status: 200, description: 'Navigation item found' })
  @ApiResponse({ status: 404, description: 'Navigation item not found' })
  async getBySlug(@Param('slug') slug: string): Promise<Navigation> {
    return await this.navigationService.getBySlug(slug);
  }
}