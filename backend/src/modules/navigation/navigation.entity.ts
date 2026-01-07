import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('navigation')
export class Navigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  @Index()
  slug: string;

  @Column({ nullable: true })
  url: string;

  @Column({ type: 'timestamp', nullable: true })
  @Index()
  last_scraped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Category, category => category.navigation)
  categories: Category[];
}