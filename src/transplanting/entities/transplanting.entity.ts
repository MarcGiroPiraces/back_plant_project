import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Transplanting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @ManyToOne(() => Plant, (plant) => plant.transplantings, { cascade: true })
  plant: number;

  @Column()
  potUpsize: boolean;

  @Column()
  soilChange: boolean;

  @Column()
  soilMix: string;
}
