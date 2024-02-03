import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Watering {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  date: Date;

  @Column({})
  fertilizer: boolean;

  @ManyToOne(() => Plant, (plant) => plant.waterings, { cascade: true })
  plant: number;
}
