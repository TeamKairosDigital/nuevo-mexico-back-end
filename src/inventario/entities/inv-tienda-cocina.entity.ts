import { User } from 'src/auth/entities/auth-user.entity';
import { Empleado } from 'src/rh/entities/rh-empleado.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
import { Inventariado } from './inv-inventariado.entity';
  
  @Entity('inv_tienda_cocina')
  export class TiendaCocina {
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @ManyToOne(() => Empleado, (empleado) => empleado.id, { nullable: true})
    @JoinColumn({ name: 'empleado_id' })
    empleado_id: Empleado;
  
    @ManyToOne(() => Inventariado, (producto) => producto.id, { nullable: true})
    @JoinColumn({ name: 'producto_id' })
    producto_id: Inventariado;
  
    @Column({ type: 'int' })
    cantidad: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    montoTotal: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    pagoEfectivo: number;
  
    @Column({ type: 'tinyint', default: 1 })
    activo: boolean;
  
    @CreateDateColumn({ name: 'fecha_creacion' })
    fechaCreacion: Date;
  
    @UpdateDateColumn({ name: 'fecha_modificacion' })
    fechaModificacion: Date;
  
    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    @JoinColumn({ name: 'usuario_creacion' })
    usuario_creacion: User;
  
    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    @JoinColumn({ name: 'usuario_modificacion' })
    usuario_modificacion: User;
  }
  