import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/auth/entities/auth-user.entity';
import { ClasificacionProducto } from './inv-clasificaciones-productos.entity';
import { Unidad } from './inv-unidades.entity';
import { Inventariado } from './inv-inventariado.entity';

@Entity('inv_entrada_inventariado')
export class EntradaInventariado {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Inventariado)
  @JoinColumn({ name: 'producto_id' })
  producto: Inventariado;

  @Column({ type: 'int' })
  entrada: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;

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
