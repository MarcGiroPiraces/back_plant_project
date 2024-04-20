import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Transplanting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Plant, (plant) => plant.transplantings, {
    onDelete: 'CASCADE',
  })
  plant: Relation<Plant>;

  @Column()
  potUpsize: boolean;

  @Column()
  soilChange: boolean;

  @Column()
  soilMix: string;
}
