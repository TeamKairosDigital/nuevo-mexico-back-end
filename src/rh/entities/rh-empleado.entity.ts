import { User } from 'src/auth/entities/auth-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TipoEmpleado } from './rh-tipo-empleado.entity';
import { TiendaCocina } from 'src/inventario/entities/inv-tienda-cocina.entity';

@Entity('rh_empleado')
export class Empleado {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    codigo_empleado: string;

    @ManyToOne(() => TipoEmpleado, (tipoEmpleado) => tipoEmpleado.empleados)
    @JoinColumn({ name: 'tipo_empleado' })
    tipo_empleado: TipoEmpleado;

    @Column({ type: 'varchar', length: 255 })
    nombre: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    telefono: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region_origen: string;

    @Column({ type: 'int', nullable: true })
    acompanantes: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ type: 'tinyint' })
    activo: boolean;

    @Column({ type: 'datetime' })
    fecha_creacion: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'usuario_creacion' })
    usuario_creacion: User;

    @Column({ type: 'datetime' })
    fecha_modificacion: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'usuario_modificacion' })
    usuario_modificacion: User;

    @OneToMany(() => TiendaCocina, (tiendaCocina) => tiendaCocina.empleado_id)
    tiendaCocina_empleado: TiendaCocina[];
}
