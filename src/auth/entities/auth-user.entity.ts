import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './auth-role.entity';
import { ClasificacionProducto } from 'src/inventario/entities/inv-clasificaciones-productos.entity';
import { Unidad } from 'src/inventario/entities/inv-unidades.entity';
import { Inventariado } from 'src/inventario/entities/inv-inventariado.entity';
import { EntradaInventariado } from 'src/inventario/entities/inv-entrada-inventariado.entity';

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

  // @OneToMany(() => Trabajador, (trabajador) => trabajador.usuario_creacion)
  // trabajadores_creados: Trabajador[];

  // @OneToMany(() => Trabajador, (trabajador) => trabajador.usuario_modificacion)
  // trabajadores_modificados: Trabajador[];

  @OneToMany(() => ClasificacionProducto, (clasificacion) => clasificacion.usuario_creacion)
  clasificaciones_creadas: ClasificacionProducto[];

  @OneToMany(() => Unidad, (unidad) => unidad.usuario_creacion)
  unidades_creadas: Unidad[];

  @OneToMany(() => Inventariado, (inventariado) => inventariado.usuario_creacion)
  inventarios_creados: Inventariado[];

  @OneToMany(() => EntradaInventariado, (entrada) => entrada.usuario_creacion)
  entradas_creadas: EntradaInventariado[];
  
}

