import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Watering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  date: Date;

  @Column({})
  fertilizer: boolean;

  @ManyToOne(() => Plant, (plant) => plant.waterings, { onDelete: 'CASCADE' })
  plant: Relation<Plant>;
}
