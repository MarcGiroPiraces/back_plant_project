import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Photo } from '../../photo/entities/photo.entity';
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
  atHomeSince: Date;

  @Column({})
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
  user: Relation<User>;

  @OneToMany(() => Watering, (watering) => watering.plant)
  waterings: Relation<Watering[]>;

  @OneToMany(() => Transplanting, (transplanting) => transplanting.plant)
  transplantings: Relation<Transplanting[]>;

  @ManyToOne(() => Spot, (spot) => spot.plants, { onDelete: 'CASCADE' })
  spot: Relation<Spot>;

  @OneToMany(() => Photo, (photo) => photo.plant)
  photos: Relation<Photo[]>;
}
