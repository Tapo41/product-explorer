import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  user_id?: string;

  @ApiProperty()
  @IsString()
  session_id: string;

  @ApiProperty()
  @IsObject()
  path_json: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  page_title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  page_url?: string;
}