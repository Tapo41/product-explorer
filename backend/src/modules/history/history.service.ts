import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ViewHistory } from './view-history.entity';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(ViewHistory)
    private historyRepository: Repository<ViewHistory>,
  ) {}

  async create(dto: CreateHistoryDto): Promise<ViewHistory> {
    const history = this.historyRepository.create({
      user_id: dto.user_id,
      session_id: dto.session_id,
      path_json: dto.path_json,
      page_title: dto.page_title,
      page_url: dto.page_url,
    });

    return await this.historyRepository.save(history);
  }

  async getBySessionId(sessionId: string, limit = 50): Promise<ViewHistory[]> {
    return await this.historyRepository.find({
      where: { session_id: sessionId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async getByUserId(userId: string, limit = 50): Promise<ViewHistory[]> {
    return await this.historyRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  async clearBySessionId(sessionId: string): Promise<void> {
    await this.historyRepository.delete({ session_id: sessionId });
  }
}