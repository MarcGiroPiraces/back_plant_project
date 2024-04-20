import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  url: string;

  @ManyToOne(() => Plant, (plant) => plant.photos, { onDelete: 'CASCADE' })
  plant: Relation<Plant>;
}
