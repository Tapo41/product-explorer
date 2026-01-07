import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HistoryService } from './history.service';
import { ViewHistory } from './view-history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@ApiTags('history')
@Controller('api/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create history entry' })
  @ApiResponse({ status: 201, description: 'History entry created' })
  async create(@Body() dto: CreateHistoryDto): Promise<ViewHistory> {
    return await this.historyService.create(dto);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get history by session ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getBySessionId(
    @Param('sessionId') sessionId: string,
    @Query('limit') limit = 50,
  ): Promise<ViewHistory[]> {
    return await this.historyService.getBySessionId(sessionId, Number(limit));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get history by user ID' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'History retrieved successfully' })
  async getByUserId(
    @Param('userId') userId: string,
    @Query('limit') limit = 50,
  ): Promise<ViewHistory[]> {
    return await this.historyService.getByUserId(userId, Number(limit));
  }

  @Delete('session/:sessionId')
  @ApiOperation({ summary: 'Clear history by session ID' })
  @ApiResponse({ status: 200, description: 'History cleared successfully' })
  async clearBySessionId(@Param('sessionId') sessionId: string): Promise<{ message: string }> {
    await this.historyService.clearBySessionId(sessionId);
    return { message: 'History cleared successfully' };
  }
}