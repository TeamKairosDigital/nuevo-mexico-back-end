import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createApiResponse } from 'src/common/response/createApiResponse';
import { Inventariado } from './entities/inv-inventariado.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
                where.nombre_producto = data.nombreProducto;
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
                        fecha: this.formatFecha(inventario.fecha_creacion),
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
            inventario.usuario_modificacion = user;

            await this.inventariadoRepository.save(inventario);

            return createApiResponse<inventarioResponseDto>(true, 'Producto creado correctamente', null, null, HttpStatus.CREATED);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el producto');
        }
    }

    // Obtener producto por ID
    async getInventarioById(id: number): Promise<ApiResponse<inventarioResponseDto>> {
        try {
            const inventario = await this.inventariadoRepository.findOne({ where: { id: id } });

            if (!inventario) {
                throw new NotFoundException(`Producto con ID ${id} no encontrado`);
            }

            const response = {
                id: inventario.id,
                codigo: inventario.codigo,
                clasificacionProducto: inventario.clasificacion_producto.nombre,
                nombre_producto: inventario.nombre_producto,
                unidad: inventario.unidad.nombre,
                inventario_inicial: inventario.inventario_inicial,
                costo_inicial: inventario.costo_inicial,
                cantidad_actual: inventario.cantidad_actual,
                precio_actual: inventario.precio_actual,
                fecha: inventario.fecha_creacion,
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

            producto.codigo = data.codigo;
            producto.clasificacion_producto = clasificacionProducto;
            producto.nombre_producto = data.nombre_producto;
            producto.unidad = unidad;
            // producto.inventario_inicial = data.inventario_inicial;
            // producto.costo_inicial = data.costo_inicial;
            // producto.cantidad_actual = data.cantidad_actual;
            // producto.precio_actual = data.precio_actual;
            producto.usuario_modificacion = user;

            await this.inventariadoRepository.save(producto);

            return createApiResponse<inventarioResponseDto>(true, 'Producto actualizado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el producto');
        }
    }

    // Eliminar producto para inventario
    async deleteInventario(id: number): Promise<ApiResponse<any>> {
        try {
            const producto = await this.inventariadoRepository.findOne({ where: { id: id } });

            if (!producto) {
                throw new NotFoundException(`Producto con ID ${id} no encontrado`);
            }

            const entradaInventariado = await this.entradaInventariadoRepository.findOne({ where: { producto: producto } });

            // if (entradaInventariado) {
            //     throw new InternalServerErrorException(`No se puede eliminar el producto porque tiene entradas en inventario`);
            // }

            if (entradaInventariado) {
                await this.entradaInventariadoRepository.delete(entradaInventariado);
            }

            await this.inventariadoRepository.delete(producto);

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
                fecha: entradaInventariado.fecha_creacion
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

    private async formatFecha(fecha: string | Date): Promise<string> {
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
    

}
