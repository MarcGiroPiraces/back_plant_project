import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Plant } from '../../plant/entities/plant.entity';
import { Spot } from '../../spot/entities/spot.entity';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

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

  @Column({
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @OneToMany(() => Plant, (plant) => plant.user)
  plants: Plant[];

  @OneToMany(() => Spot, (spot) => spot.user)
  spots: Spot[];
}
