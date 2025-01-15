import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './auth-user.entity';

@Entity('auth_Roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'tinyint' })
  activo: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @Column({ type: 'bigint' })
  usuario_creacion: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion: Date;

  @Column({ type: 'bigint' })
  usuario_modificacion: number;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
