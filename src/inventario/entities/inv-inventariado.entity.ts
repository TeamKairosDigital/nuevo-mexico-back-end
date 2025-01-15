import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from 'src/auth/entities/auth-user.entity';
import { ClasificacionProducto } from './inv-clasificaciones-productos.entity';
import { Unidad } from './inv-unidades.entity';
import { EntradaInventariado } from './inv-entrada-inventariado.entity';

@Entity('inv_inventariado')
export class Inventariado {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 50 })
  codigo: string;

  @ManyToOne(() => ClasificacionProducto)
  @JoinColumn({ name: 'clasificacion_producto_id' })
  clasificacion_producto: ClasificacionProducto;

  @Column({ type: 'varchar', length: 255 })
  nombre_producto: string;

  @ManyToOne(() => Unidad)
  @JoinColumn({ name: 'unidad_id' })
  unidad: Unidad;

  @Column({ type: 'int' })
  inventario_inicial: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo_inicial: number;

  @Column({ type: 'int' })
  cantidad_actual: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_actual: number;

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

  @OneToMany(() => EntradaInventariado, (entrada) => entrada.producto)
  entradaInventariado: EntradaInventariado[];

}

