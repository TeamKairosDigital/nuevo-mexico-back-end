import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createApiResponse } from 'src/common/response/createApiResponse';
import { Inventariado } from './entities/inv-inventariado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ClasificacionProducto } from './entities/inv-clasificaciones-productos.entity';
import { Unidad } from './entities/inv-unidades.entity';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { filterInventarioDto } from './dto/input/filterInventario.dto';
import { entradaInventariadoResponseDto, inventarioResponseDto } from './dto/output/inventarioResponse.dto';
import { createInventarioDto } from './dto/input/createInventario.dto';
import { EntradaInventariado } from './entities/inv-entrada-inventariado.entity';
import { User } from 'src/auth/entities/auth-user.entity';
import { createEntradaInventarioDto } from './dto/input/createEntradaInventario.dto';
import { itemsResponseDto } from './dto/output/itemsResponse.dto';
import { filterVentaDto } from './dto/input/filterVenta.dto';
import { Empleado } from 'src/rh/entities/rh-empleado.entity';
import { TiendaCocina } from './entities/inv-tienda-cocina.entity';
import { ventaResponseDto } from './dto/output/ventaResponse.dto';
import { createVentaDto } from './dto/input/createVenta.dto';

@Injectable()
export class InventarioService {

    constructor(
        @InjectRepository(Inventariado)
        private inventariadoRepository: Repository<Inventariado>,
        @InjectRepository(ClasificacionProducto)
        private clasificacionProductoRepository: Repository<ClasificacionProducto>,
        @InjectRepository(Unidad)
        private unidadRepository: Repository<Unidad>,
        @InjectRepository(EntradaInventariado)
        private entradaInventariadoRepository: Repository<EntradaInventariado>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Empleado)
        private empleadoRepository: Repository<Empleado>,
        @InjectRepository(TiendaCocina)
        private tiendaCocinaRepository: Repository<TiendaCocina>,
    ) { }

    // Lista de inventario
    async getListInventario(data: filterInventarioDto): Promise<ApiResponse<inventarioResponseDto[]>> {
        try {
            // Obtener las entidades relacionadas, si se proporcionan los IDs en el filtro
            const clasificacionProducto = data.idClasificacionProducto 
                ? await this.clasificacionProductoRepository.findOne({ where: { id: data.idClasificacionProducto } }) 
                : null;
    
            const unidad = data.idUnidad 
                ? await this.unidadRepository.findOne({ where: { id: data.idUnidad } }) 
                : null;
    
            // Construir los filtros dinámicamente
            const where: any = {
                activo: true, // Aseguramos que solo se obtengan los elementos activos
            };
    
            if (data.codigo) {
                where.codigo = data.codigo;
            }
    
            if (clasificacionProducto) {
                where.clasificacion_producto = clasificacionProducto;
            }
    
            if (data.nombreProducto) {
                where.nombre_producto = Like(`%${data.nombreProducto}%`); // Permite coincidencias parciales
            }
    
            if (unidad) {
                where.unidad = unidad;
            }
    
            // Consulta al repositorio con las relaciones correspondientes
            const inventario = await this.inventariadoRepository.find({
                relations: ['clasificacion_producto', 'unidad', 'entradaInventariado'],
                where: where,
                order: { id: 'ASC' },
            });
    
            // Mapear los datos para devolverlos en la respuesta
            const listData = inventario.map((inventario) => ({
                id: inventario.id,
                codigo: inventario.codigo,
                clasificacionProducto: inventario.clasificacion_producto?.nombre || null,
                nombre_producto: inventario.nombre_producto,
                unidad: inventario.unidad?.nombre || null,
                inventario_inicial: inventario.inventario_inicial,
                costo_inicial: inventario.costo_inicial,
                cantidad_actual: inventario.cantidad_actual,
                precio_actual: inventario.precio_actual,
                fecha: this.formatFecha(inventario.fecha_creacion),
                entradaInventariado: Array.isArray(inventario.entradaInventariado)
                    ? inventario.entradaInventariado.map((entrada) => ({
                        id: entrada.id,
                        entrada: entrada.entrada,
                        costo: entrada.costo,
                        fecha: this.formatFecha(entrada.fecha_creacion),
                    }))
                    : [],
            }));
    
            return createApiResponse<inventarioResponseDto[]>(true, 'Lista obtenida correctamente', listData, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la lista de inventario');
        }
    }

    // Producto
    // Crear producto para inventario
    async createInventario(data: createInventarioDto): Promise<ApiResponse<any>> {
        try {
            const clasificacionProducto = await this.clasificacionProductoRepository.findOne({ where: { id: data.idClasificacionProducto } });

            if (!clasificacionProducto) {
                throw new NotFoundException(`Clasificación del producto con ID ${data.idClasificacionProducto} no encontrado`);
            }

            const unidad = await this.unidadRepository.findOne({ where: { id: data.idUnidad } });

            if (!unidad) {
                throw new NotFoundException(`Unidad con ID ${data.idUnidad} no encontrada`);
            }

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }
            
            const inventario = new Inventariado();
            inventario.codigo = data.codigo;
            inventario.clasificacion_producto = clasificacionProducto;
            inventario.nombre_producto = data.nombre_producto;
            inventario.unidad = unidad;
            inventario.inventario_inicial = data.inventario_inicial;
            inventario.costo_inicial = data.costo_inicial;
            inventario.cantidad_actual = data.inventario_inicial;
            inventario.precio_actual = data.costo_inicial;
            inventario.activo = true;
            inventario.usuario_creacion = user;
            inventario.fecha_creacion = new Date();
            inventario.usuario_modificacion = user;
            inventario.fecha_modificacion = new Date();

            await this.inventariadoRepository.save(inventario);

            return createApiResponse<inventarioResponseDto>(true, 'Producto creado correctamente', null, null, HttpStatus.CREATED);
        } catch (error) {
            throw error;
        }
    }

    // Obtener producto por ID
    async getInventarioById(id: number): Promise<ApiResponse<inventarioResponseDto>> {
        try {
            const inventario = await this.inventariadoRepository.findOne({ 
                relations: ['clasificacion_producto', 'unidad'], 
                where: { id: id } 
            });

            if (!inventario) {
                throw new NotFoundException(`Producto con ID ${id} no encontrado`);
            }

            const response = {
                id: inventario.id,
                codigo: inventario.codigo,
                clasificacionProducto: inventario.clasificacion_producto.nombre,
                idClasificacionProducto: inventario.clasificacion_producto.id,
                nombre_producto: inventario.nombre_producto,
                unidad: inventario.unidad.nombre,
                idUnidad: inventario.unidad.id,
                inventario_inicial: inventario.inventario_inicial,
                costo_inicial: inventario.costo_inicial,
                cantidad_actual: inventario.cantidad_actual,
                precio_actual: inventario.precio_actual,
                fecha: this.formatFecha(inventario.fecha_creacion),
                entradaInventariado: [],
            };

            return createApiResponse<inventarioResponseDto>(true, 'Producto obtenido correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener el producto');
        }
    }

    // Actualizar producto para inventario
    async updateInventario(data: createInventarioDto): Promise<ApiResponse<any>> {
        try {
            const clasificacionProducto = await this.clasificacionProductoRepository.findOne({ where: { id: data.idClasificacionProducto } });

            if (!clasificacionProducto) {
                throw new NotFoundException(`Clasificación del producto con ID ${data.idClasificacionProducto} no encontrado`);
            }

            const unidad = await this.unidadRepository.findOne({ where: { id: data.idUnidad } });

            if (!unidad) {
                throw new NotFoundException(`Unidad con ID ${data.idUnidad} no encontrada`);
            }

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }

            const producto = await this.inventariadoRepository.findOne({ where: { id: data.id } });

            if (!producto) {
                throw new NotFoundException(`Producto con ID ${data.id} no encontrado`);
            }

            if(producto.inventario_inicial == 0 && producto.costo_inicial == 0 &&
                producto.cantidad_actual == 0 && producto.precio_actual == 0){
                producto.inventario_inicial = data.inventario_inicial;
                producto.costo_inicial = data.costo_inicial;
                producto.cantidad_actual = data.inventario_inicial;
                producto.precio_actual = data.costo_inicial;
            }

            producto.codigo = data.codigo;
            producto.clasificacion_producto = clasificacionProducto;
            producto.nombre_producto = data.nombre_producto;
            producto.unidad = unidad;
            producto.usuario_modificacion = user;
            producto.fecha_modificacion = new Date();

            await this.inventariadoRepository.save(producto);

            return createApiResponse<inventarioResponseDto>(true, 'Producto actualizado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw error;
        }
    }

    // Eliminar producto para inventario
    async deleteInventario(id: number): Promise<ApiResponse<any>> {
        try {

            // const entradaInventariado = await this.entradaInventariadoRepository.findOne({ where: { producto: producto } });

            // if (entradaInventariado) {
            //     throw new InternalServerErrorException(`No se puede eliminar el producto porque tiene entradas en inventario`);
            // }

            // if (entradaInventariado) {
            //     await this.entradaInventariadoRepository.delete(entradaInventariado);
            // }

            const producto = await this.inventariadoRepository.findOne({ where: { id: id } });

            if (!producto) {
                throw new NotFoundException(`Producto con ID ${id} no encontrado`);
            }

            producto.activo = false;

            await this.inventariadoRepository.save(producto);

            // await this.inventariadoRepository.delete(producto);

            return createApiResponse<inventarioResponseDto>(true, 'Producto eliminado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el producto');
        }
    }
    // Producto

    // Entrada producto
    // Crear entrada para inventario
    async createEntradaInventario(data: createEntradaInventarioDto): Promise<ApiResponse<any>> {
        try {

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }

            const producto = await this.inventariadoRepository.findOne({ where: { id: data.id_producto } });
            
            if (!producto) {
                throw new NotFoundException(`Producto con ID ${data.id} no encontrado`);
            }

            const entradaInventariado = new EntradaInventariado();
            entradaInventariado.producto = producto;
            entradaInventariado.entrada = data.entrada;
            entradaInventariado.costo = data.costo; 
            entradaInventariado.activo = true;
            entradaInventariado.usuario_creacion = user;
            entradaInventariado.usuario_modificacion = user;

            await this.calculateInventario(data);

            await this.entradaInventariadoRepository.save(entradaInventariado);

            return createApiResponse<inventarioResponseDto>(true, 'Producto creado correctamente', null, null, HttpStatus.CREATED);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el producto');
        }
    }

    // Obtener entrada por ID
    async getEntradaInventarioById(id: number): Promise<ApiResponse<entradaInventariadoResponseDto>> {
        try {
            const entradaInventariado = await this.entradaInventariadoRepository.findOne({ where: { id: id } });

            if (!entradaInventariado) {
                throw new NotFoundException(`Entrada en inventario con ID ${id} no encontrada`);
            }

            const response = {
                id: entradaInventariado.id,
                entrada: entradaInventariado.entrada,
                costo: entradaInventariado.costo,
                fecha: this.formatFecha(entradaInventariado.fecha_creacion)
            };

            return createApiResponse<entradaInventariadoResponseDto>(true, 'Entrada obtenida correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la entrada');
        }
    }

    // Actualizar entrada para inventario
    async updateEntradaInventario(data: createEntradaInventarioDto): Promise<ApiResponse<any>> {
        try {

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }

            const entradaInventariado = await this.entradaInventariadoRepository.findOne({ where: { id: data.id } });

            if (!entradaInventariado) {
                throw new NotFoundException(`Entrada en inventario con ID ${data.id} no encontrada`);
            }

            entradaInventariado.entrada = data.entrada;
            entradaInventariado.costo = data.costo;
            entradaInventariado.usuario_modificacion = user;

            await this.entradaInventariadoRepository.save(entradaInventariado);

            await this.calculateInventario(data);

            return createApiResponse<inventarioResponseDto>(true, 'Entrada actualizada correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar la entrada');
        }
    }

    // Eliminar entrada para inventario
    async deleteEntradaInventario(id: number): Promise<ApiResponse<any>> {
        try {
            const entradaInventariado = await this.entradaInventariadoRepository.findOne({ where: { id: id } });

            if (!entradaInventariado) {
                throw new NotFoundException(`Entrada en inventario con ID ${id} no encontrada`);
            }

            const data = new createEntradaInventarioDto();
            data.id = entradaInventariado.id;
            data.entrada = entradaInventariado.entrada;
            data.costo = entradaInventariado.costo;

            await this.calculateInventario(data);

            await this.entradaInventariadoRepository.delete(entradaInventariado);

            return createApiResponse<inventarioResponseDto>(true, 'Entrada eliminada correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar la entrada');
        }
    }
    // Entrada producto

    // Paramatros
    // Lista de clasificacion de productos por activo true
    async getClasificacionProductos(): Promise <ApiResponse<itemsResponseDto[]>> {
        try {
            const clasificaciones = await this.clasificacionProductoRepository.find({ where: { activo: true } });

            const response = clasificaciones.map(clasificacion => ({
                id: clasificacion.id,
                nombre: clasificacion.nombre,
            }));

            return createApiResponse<itemsResponseDto[]>(true, 'Lista de clasificaciones obtenida correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al acceder la lista de clasificiacion de productos');
        }
    }

    // Lista de unidades para los productos
    async getUnidades(): Promise<ApiResponse<itemsResponseDto[]>> {
        try {
            const unidades = await this.unidadRepository.find({ where: { activo: true } });

            const response = unidades.map(unidad => ({
                id: unidad.id,
                nombre: unidad.nombre,
            }));

            return createApiResponse<itemsResponseDto[]>(true, 'Lista de unidades obtenida correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al acceder la lista de unidades');
        }
    }

    // Ventas
    // Lista de ventas
    async getListVentas(data: filterVentaDto): Promise<ApiResponse<ventaResponseDto[]>> {
        try {
            // Obtener las entidades relacionadas, si se proporcionan los IDs en el filtro
            const empleado = data.idEmpleado 
                ? await this.empleadoRepository.findOne({ where: { id: data.idEmpleado } }) 
                : null;
    
            const producto = data.idProducto
                ? await this.inventariadoRepository.findOne({ where: { id: data.idProducto } }) 
                : null;
    
            // Construir los filtros dinámicamente
            const where: any = {
                activo: true, // Aseguramos que solo se obtengan los elementos activos
            };
    
            if (empleado) {
                where.empleado_id = empleado;
            }

            if (producto) {
                where.producto_id = producto;
            }
    
            // if (data.nombreProducto) {
            //     where.nombre_producto = Like(`%${data.nombreProducto}%`); // Permite coincidencias parciales
            // }

            // if (data.codigo) {
            //     where.codigo = data.codigo;
            // }
    
            // Consulta al repositorio con las relaciones correspondientes
            const tiendaCocina = await this.tiendaCocinaRepository.find({
                relations: ['empleado_id', 'producto_id', 'usuario_creacion','usuario_modificacion'],
                where: where,
                order: { id: 'ASC' },
            });
    
            // Mapear los datos para devolverlos en la respuesta
            const listData = tiendaCocina.map((venta) => ({
                id: venta.id,
                codigoEmpleado: venta.empleado_id.codigo_empleado,
                nombreEmpleado: venta.empleado_id?.nombre,
                cantidadUnidad: venta.cantidad,
                idProducto: venta.producto_id.id,
                nombreProducto: venta.producto_id.nombre_producto,
                // precioSugerido: venta.,
                montoTotal: venta.montoTotal,
                pagoEfectivo: venta.pagoEfectivo,
                fechaCracion: this.formatFecha(venta.fechaCreacion),
            }));
    
            return createApiResponse<ventaResponseDto[]>(true, 'Lista obtenida correctamente', listData, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la lista de inventario');
        }
    }

    // Producto
    // Crear producto para inventario
    async createVenta(data: createVentaDto): Promise<ApiResponse<any>> {
        try {
            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }

            const empleado = await this.empleadoRepository.findOne({ where: { id: data.empleado_id } });

            if (!empleado) {
                throw new NotFoundException(`Empleado con ID ${data.empleado_id} no encontrado`);
            }

            data.listaProductos.forEach(async element => {

                const producto = await this.inventariadoRepository.findOne({ where: { id: element.producto_id } });

                if (!producto) {
                    throw new NotFoundException(`Producto con ID ${element.producto_id} no encontrada`);
                }
    
                const venta = new TiendaCocina();
                venta.empleado_id = empleado;
                venta.producto_id = producto;
                venta.precioVenta = producto.precio_actual;
                venta.cantidad = element.cantidad;
                venta.montoTotal = element.montoTotal;
                venta.pagoEfectivo = element.cantidad;
                venta.activo = true;
                venta.usuario_creacion = user;
                venta.fechaCreacion = new Date();
                venta.usuario_modificacion = user;
                venta.fechaModificacion = new Date();
    
                await this.tiendaCocinaRepository.save(venta);

                //CREAR LOGÍCA PARA DESCONTAR EN INVENTARIO
                this.discountInventory(producto, element.cantidad, element.cantidad);
                
            });

            return createApiResponse<any>(true, 'Venta creado correctamente', null, null, HttpStatus.CREATED);
        } catch (error) {
            throw error;
        }
    }
    
    // Obtener lista de inventariado
    async getInventario(): Promise <ApiResponse<itemsResponseDto[]>> {
        try {
            // const productos = await this.inventariadoRepository.find({ where: { activo: true } });
            const productos = await this.inventariadoRepository
                                    .createQueryBuilder('producto')
                                    .where('producto.activo = :activo', { activo: true })
                                    .andWhere('producto.cantidad_actual > :cantidad', { cantidad: 0 })
                                    .getMany();

            const response = productos.map(producto => ({
                id: producto.id,
                nombre: producto.nombre_producto,
                precio_actual: producto.precio_actual,
                cantidad_actual: producto.cantidad_actual
            }));
            //const response = productos ? { id: productos.id, nombre: productos.nombre_producto } : null; // Maneja el caso donde no haya resultados

            return createApiResponse<itemsResponseDto[]>(true, 'Lista de productos obtenida correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al acceder la lista de clasificiacion de productos');
        }
    }

    // Calcular inventario de producto cantidad actual y precio actual
    private async calculateInventario(data: createEntradaInventarioDto): Promise<any> {
        try {

            const producto = await this.inventariadoRepository.findOne({ where: { id: data.id_producto } });

            if (!producto) {
                throw new NotFoundException(`Producto con ID ${data.id} no encontrado`);
            }

            let sumCantidad = producto.cantidad_actual + data.entrada;
            let sumPrecio = (producto.precio_actual * producto.cantidad_actual) + (data.costo * data.entrada);

            let promedio = sumPrecio / sumCantidad;

            producto.cantidad_actual = sumCantidad;
            producto.precio_actual = promedio;
            await this.inventariadoRepository.save(producto);

            return createApiResponse<inventarioResponseDto>(true, 'Producto actualizado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el producto');
        }
    }

    private formatFecha(fecha: string | Date): string {
        const date = new Date(fecha);
        const opciones: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return date.toLocaleString('es-ES', opciones).replace(',', '');
    }

    private async discountInventory(producto: Inventariado, cantidad: number, pagoEfectivo: number){

        // Restamos cantidad acutal - cantidad que se seleccion por el producto
        producto.cantidad_actual = producto.cantidad_actual - cantidad;

        // Multiplicamos la cantidad actual del producto * el precio actual del producto - la cantidad del pago en efectivo
        let precioTotal = (producto.cantidad_actual * producto.precio_actual) - pagoEfectivo;

        // Dividmos el precio calculado / producto de cantidad actual restado
        let precioCalculado = precioTotal / producto.cantidad_actual;

        producto.precio_actual = precioCalculado;

        await this.inventariadoRepository.save(producto);

    }

}
