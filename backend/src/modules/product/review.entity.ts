import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  product_id: string;

  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  author: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  text: string;

  @Column({ type: 'timestamp', nullable: true })
  review_date: Date;

  @CreateDateColumn()
  created_at: Date;
}