import { User } from 'src/auth/entities/auth-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Inventariado } from './inv-inventariado.entity';

@Entity('inv_clasificaciones_productos')
export class ClasificacionProducto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'tinyint' })
  activo: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_creacion: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_creacion' })
  usuario_creacion: User;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  fecha_modificacion: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuario_modificacion' })
  usuario_modificacion: User;
}

