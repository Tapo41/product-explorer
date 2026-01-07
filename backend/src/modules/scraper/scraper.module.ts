import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraper.service';
import { ScrapeJob } from './scrape-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScrapeJob])],
  providers: [ScraperService],
  exports: [ScraperService],
})
export class ScraperModule {}