import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './auth-role.entity';
import { ClasificacionProducto } from 'src/inventario/entities/inv-clasificaciones-productos.entity';
import { Unidad } from 'src/inventario/entities/inv-unidades.entity';
import { Inventariado } from 'src/inventario/entities/inv-inventariado.entity';
import { EntradaInventariado } from 'src/inventario/entities/inv-entrada-inventariado.entity';
import { Empleado } from 'src/rh/entities/rh-empleado.entity';
import { TipoEmpleado } from 'src/rh/entities/rh-tipo-empleado.entity';
import { TiendaCocina } from 'src/inventario/entities/inv-tienda-cocina.entity';

@Entity('auth_Users')
export class User {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  user_name: string;

  @Column({ type: 'varchar', length: 255 })
  pass_hash: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

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

  @OneToMany(() => Empleado, (empleado) => empleado.usuario_creacion)
  empleado_creados: Empleado[];

  @OneToMany(() => Empleado, (empleado) => empleado.usuario_modificacion)
  empleado_modificados: Empleado[];

  @OneToMany(() => ClasificacionProducto, (clasificacion) => clasificacion.usuario_creacion)
  clasificaciones_creadas: ClasificacionProducto[];

  @OneToMany(() => Unidad, (unidad) => unidad.usuario_creacion)
  unidades_creadas: Unidad[];

  @OneToMany(() => Inventariado, (inventariado) => inventariado.usuario_creacion)
  inventarios_creados: Inventariado[];

  @OneToMany(() => EntradaInventariado, (entrada) => entrada.usuario_creacion)
  entradas_creadas: EntradaInventariado[];

  @OneToMany(() => TipoEmpleado, (tipoEmpleado) => tipoEmpleado.usuario_creacion)
  tipoEmpleado_creados: TipoEmpleado[];

  @OneToMany(() => TipoEmpleado, (tipoEmpleado) => tipoEmpleado.usuario_modificacion)
  tipoEmpleado_modificados: TipoEmpleado[];

  @OneToMany(() => TiendaCocina, (tiendaCocina) => tiendaCocina.usuario_creacion)
  tiendaCocina_creados: TiendaCocina[];

  @OneToMany(() => TiendaCocina, (tiendaCocina) => tiendaCocina.usuario_modificacion)
  tiendaCocina_modificados: TiendaCocina[];
  
}

