import { User } from 'src/auth/entities/auth-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoEmpleado } from './rh-tipo-empleado.entity';

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
