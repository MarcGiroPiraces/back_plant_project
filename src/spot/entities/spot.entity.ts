import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';
import { User } from '../../user/entities/user.entity';

export const roomOptions = {
  terrassa: 'Terrassa',
  tenjador: 'Menjador',
  despatxBoleti: 'Bedroom',
  despatxMarquitus: 'Bathroom',
  dormitori: 'Dormitori',
} as const;

export type Room = (typeof roomOptions)[keyof typeof roomOptions];

@Entity()
export class Spot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  room: Room;

  @Column({})
  place: string;

  @OneToMany(() => Plant, (plant) => plant.spot)
  plants: number[];

  @ManyToOne(() => User, (user) => user.spots)
  user: number;
}
