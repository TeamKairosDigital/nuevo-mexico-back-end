import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventariado } from './entities/inv-inventariado.entity';
import { EntradaInventariado } from './entities/inv-entrada-inventariado.entity';
import { ClasificacionProducto } from './entities/inv-clasificaciones-productos.entity';
import { Unidad } from './entities/inv-unidades.entity';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';
import { AuthModule } from 'src/auth/auth.module';
import { TiendaCocina } from './entities/inv-tienda-cocina.entity';
import { RhModule } from 'src/rh/rh.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Inventariado, EntradaInventariado, ClasificacionProducto, Unidad, TiendaCocina]),
        forwardRef(() => AuthModule),
        forwardRef(() => RhModule)
    ],
    controllers: [InventarioController],
    providers: [InventarioService],
    exports: [InventarioService],
})
export class InventarioModule {}
