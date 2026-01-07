import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum ScrapeJobStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum ScrapeJobType {
  NAVIGATION = 'navigation',
  CATEGORY = 'category',
  PRODUCTS = 'products',
  PRODUCT_DETAIL = 'product_detail',
}

@Entity('scrape_job')
export class ScrapeJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  target_url: string;

  @Column({
    type: 'enum',
    enum: ScrapeJobType,
  })
  target_type: ScrapeJobType;

  @Column({
    type: 'enum',
    enum: ScrapeJobStatus,
    default: ScrapeJobStatus.PENDING,
  })
  @Index()
  status: ScrapeJobStatus;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  finished_at: Date;

  @Column({ type: 'text', nullable: true })
  error_log: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}