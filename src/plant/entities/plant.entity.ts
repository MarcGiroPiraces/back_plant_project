import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spot } from '../../spot/entities/spot.entity';
import { Transplanting } from '../../transplanting/entities/transplanting.entity';
import { User } from '../../user/entities/user.entity';
import { Watering } from '../../watering/entities/watering.entity';

@Entity()
export class Plant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({})
  description: string;

  @Column({})
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
  user: number;

  @OneToMany(() => Watering, (watering) => watering.plant)
  waterings: number[];

  @OneToMany(() => Transplanting, (transplanting) => transplanting.plant)
  transplantings: number[];

  @ManyToOne(() => Spot, (spot) => spot.plants, { cascade: true })
  spot: number;
}
