import { forwardRef, Module } from '@nestjs/common';
import { RhService } from './rh.service';
import { RhController } from './rh.controller';
import { Empleado } from './entities/rh-empleado.entity';
import { TipoEmpleado } from './entities/rh-tipo-empleado.entity';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioModule } from 'src/inventario/inventario.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Empleado, TipoEmpleado]),
        forwardRef(() => AuthModule),
        forwardRef(() => InventarioModule)
    ],
  providers: [RhService],
  controllers: [RhController],
  exports: [RhService, TypeOrmModule]
})
export class RhModule {}
