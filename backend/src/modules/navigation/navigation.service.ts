import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Navigation } from './navigation.entity';
import { ScraperService } from '../scraper/scraper.service';

@Injectable()
export class NavigationService {
  private readonly logger = new Logger(NavigationService.name);
  private readonly CACHE_DURATION_HOURS = 24;

  constructor(
    @InjectRepository(Navigation)
    private navigationRepository: Repository<Navigation>,
    private scraperService: ScraperService,
  ) {}

  async getAll(forceRefresh = false): Promise<Navigation[]> {
    if (!forceRefresh) {
      const cached = await this.navigationRepository.find({
        order: { title: 'ASC' },
      });

      if (cached.length > 0) {
        const oldestCache = await this.navigationRepository.findOne({
          where: {},
          order: { last_scraped_at: 'ASC' },
        });

        const cacheExpiry = new Date();
        cacheExpiry.setHours(cacheExpiry.getHours() - this.CACHE_DURATION_HOURS);

        if (oldestCache && oldestCache.last_scraped_at > cacheExpiry) {
          return cached;
        }
      }
    }

    return await this.scrapeAndSave();
  }

  async scrapeAndSave(): Promise<Navigation[]> {
    this.logger.log('Scraping navigation items...');
    
    try {
      const scrapedItems = await this.scraperService.scrapeNavigation();
      const savedItems = [];

      for (const item of scrapedItems) {
        let navigation = await this.navigationRepository.findOne({
          where: { slug: item.slug },
        });

        if (navigation) {
          navigation.title = item.title;
          navigation.url = item.url;
          navigation.last_scraped_at = new Date();
        } else {
          navigation = this.navigationRepository.create({
            title: item.title,
            slug: item.slug,
            url: item.url,
            last_scraped_at: new Date(),
          });
        }

        savedItems.push(await this.navigationRepository.save(navigation));
      }

      this.logger.log(`Saved ${savedItems.length} navigation items`);
      return savedItems;
    } catch (error) {
      this.logger.error('Failed to scrape navigation', error.stack);
      
      // Return cached data if available
      const cached = await this.navigationRepository.find();
      if (cached.length > 0) {
        this.logger.log('Returning cached navigation data due to scrape failure');
        return cached;
      }
      
      throw error;
    }
  }

  async getById(id: string): Promise<Navigation> {
    return await this.navigationRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
  }

  async getBySlug(slug: string): Promise<Navigation> {
    return await this.navigationRepository.findOne({
      where: { slug },
      relations: ['categories'],
    });
  }
}