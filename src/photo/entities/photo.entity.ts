import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  url: string;

  @ManyToOne(() => Plant, (plant) => plant.photos, { onDelete: 'CASCADE' })
  plant: Plant;
}
