import { Test, TestingModule } from '@nestjs/testing';
import { NavigationService } from './navigation.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Navigation } from './navigation.entity';
import { ScraperService } from '../scraper/scraper.service';

describe('NavigationService', () => {
  let service: NavigationService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockScraperService = {
    scrapeNavigation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NavigationService,
        {
          provide: getRepositoryToken(Navigation),
          useValue: mockRepository,
        },
        {
          provide: ScraperService,
          useValue: mockScraperService,
        },
      ],
    }).compile();

    service = module.get<NavigationService>(NavigationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached navigation items', async () => {
    const mockData = [
      { id: '1', title: 'Books', slug: 'books', last_scraped_at: new Date() },
    ];
    mockRepository.find.mockResolvedValue(mockData);

    const result = await service.getAll(false);
    expect(result).toEqual(mockData);
  });
});