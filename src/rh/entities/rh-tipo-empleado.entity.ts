import { User } from 'src/auth/entities/auth-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Empleado } from './rh-empleado.entity';

@Entity('rh_tipo_empleado')
export class TipoEmpleado {
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

    @OneToMany(() => Empleado, (empleado) => empleado.tipo_empleado)
    empleados: Empleado[];
    
}
