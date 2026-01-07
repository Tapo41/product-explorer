import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('view_history')
export class ViewHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Index()
  user_id: string;

  @Column()
  @Index()
  session_id: string;

  @Column({ type: 'jsonb' })
  path_json: Record<string, any>;

  @Column({ nullable: true })
  page_title: string;

  @Column({ nullable: true })
  page_url: string;

  @CreateDateColumn()
  created_at: Date;
}