import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';
import { Spot } from '../../spot/entities/spot.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Plant, (plant) => plant.user)
  plants: number[];

  @OneToMany(() => Spot, (spot) => spot.user)
  spots: Spot[];
}
