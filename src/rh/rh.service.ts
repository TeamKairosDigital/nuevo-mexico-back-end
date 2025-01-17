import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/rh-empleado.entity';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { filterEmpleadoDto } from './dto/input/filterEmpleado.dto';
import { EmpleadoResponseDto } from './dto/output/empleadoResponseDto';
import { TipoEmpleado } from './entities/rh-tipo-empleado.entity';
import { createApiResponse } from 'src/common/response/createApiResponse';
import { User } from 'src/auth/entities/auth-user.entity';
import { CreateEmpleadoDto } from './dto/input/createEmpleado.dto';
import { itemsResponseDto } from 'src/inventario/dto/output/itemsResponse.dto';

@Injectable()
export class RhService {

    constructor(
        @InjectRepository(Empleado)
        private empleadoRepository: Repository<Empleado>,
        @InjectRepository(TipoEmpleado)
        private tipoEmpleadoRepository: Repository<TipoEmpleado>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    // EMPLEADOS
    // Lista de empleados
    async getListEmpleado(data: filterEmpleadoDto): Promise<ApiResponse<EmpleadoResponseDto[]>> {
        try {
            // Obtener las entidades relacionadas, si se proporcionan los IDs en el filtro
            const tipoEmpleado = data.idTipoEmpleado 
                ? await this.tipoEmpleadoRepository.findOne({ where: { id: data.idTipoEmpleado } }) 
                : null;
    
            // Construir los filtros dinámicamente
            const where: any = {
                activo: true, // Aseguramos que solo se obtengan los elementos activos
            };
    
            if (tipoEmpleado) {
                where.tipo_empleado = tipoEmpleado;
            }
    
            if (data.nombreEmpleado) {
                where.nombre_producto = Like(`%${data.nombreEmpleado}%`); // Permite coincidencias parciales
            }
    
            // Consulta al repositorio con las relaciones correspondientes
            const empleados = await this.empleadoRepository.find({
                relations: ['tipo_empleado', 'usuario_creacion'],
                where: where,
                order: { id: 'ASC' },
            });
    
            // Mapear los datos para devolverlos en la respuesta
            const listData = empleados.map((empleado) => ({
                id: empleado.id,
                codigo_empleado: empleado.codigo_empleado,
                tipoEmpelado: empleado.tipo_empleado?.nombre || null,
                nombre_Empleado: empleado.nombre,
                telefono: empleado.telefono,
                region_origen: empleado.region_origen,
                // acompanantes: empleado.acompanantes,
                observaciones: empleado.observaciones,
                usuario_creacion: empleado.usuario_creacion?.nombre || null,
                fecha_creacion: this.formatFecha(empleado.fecha_creacion),
                usuario_modificacion: empleado.usuario_modificacion?.nombre || null,
                fecha_modificacion: this.formatFecha(empleado.fecha_modificacion)
            }));
    
            return createApiResponse<EmpleadoResponseDto[]>(true, 'Lista obtenida correctamente', listData, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener la lista de inventario');
        }
    }

    // Crear Empleado
    async createEmpleado(data: CreateEmpleadoDto): Promise<ApiResponse<any>> {
        try {
            const tipoEmpleado = await this.tipoEmpleadoRepository.findOne({ where: { id: data.idTipoEmpelado } });

            if (!tipoEmpleado) {
                throw new NotFoundException(`Clasificación del Empleado con ID ${data.id} no encontrado`);
            }

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }
            
            const empleado = new Empleado();
            empleado.codigo_empleado = data.codigo_empleado;
            empleado.tipo_empleado = tipoEmpleado;
            empleado.nombre = data.nombre_Empleado;
            empleado.telefono = data.telefono;
            empleado.region_origen = data.region_origen;
            empleado.acompanantes = data.acompanantes;
            empleado.observaciones = data.observaciones;
            empleado.activo = true;
            empleado.usuario_creacion = user;
            empleado.usuario_modificacion = user;

            await this.empleadoRepository.save(empleado);

            return createApiResponse<EmpleadoResponseDto>(true, 'Empleado creado correctamente', null, null, HttpStatus.CREATED);
        } catch (error) {
            throw new InternalServerErrorException('Error al crear el Empleado');
        }
    }

    // Obtener empleado por ID
    async getEmpleadoById(id: number): Promise<ApiResponse<EmpleadoResponseDto>> {
        try {
            const empleado = await this.empleadoRepository.findOne({ where: { id: id } });

            if (!empleado) {
                throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
            }

            const response = {
                id: empleado.id,
                codigo_empleado: empleado.codigo_empleado,
                tipoEmpelado: empleado.tipo_empleado?.nombre || null,
                nombre_Empleado: empleado.nombre,
                telefono: empleado.telefono,
                region_origen: empleado.region_origen,
                // acompanantes: empleado.acompanantes,
                observaciones: empleado.observaciones,
                usuario_creacion: empleado.usuario_creacion?.nombre || null,
                fecha_creacion: this.formatFecha(empleado.fecha_creacion),
                usuario_modificacion: empleado.usuario_modificacion?.nombre || null,
                fecha_modificacion: this.formatFecha(empleado.fecha_modificacion)
            };

            return createApiResponse<EmpleadoResponseDto>(true, 'Empleado obtenido correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al obtener el Empleado');
        }
    }

    // Actualizar Empleado
    async updateEmpleado(data: CreateEmpleadoDto): Promise<ApiResponse<any>> {
        try {
            const tipoEmpleado = await this.tipoEmpleadoRepository.findOne({ where: { id: data.idTipoEmpelado } });

            if (!tipoEmpleado) {
                throw new NotFoundException(`Clasificación del Empleado con ID ${data.id} no encontrado`);
            }

            const user = await this.userRepository.findOne({ where: { id: data.idUsuario } });

            if (!user) {
                throw new NotFoundException(`Usuario con ID ${data.idUsuario} no encontrada`);
            }

            const empleado = await this.empleadoRepository.findOne({ where: { id: data.id } });

            if (!empleado) {
                throw new NotFoundException(`Empleado con ID ${data.id} no encontrado`);
            }

            empleado.codigo_empleado = data.codigo_empleado;
            empleado.tipo_empleado = tipoEmpleado;
            empleado.nombre = data.nombre_Empleado;
            empleado.telefono = data.telefono;
            empleado.region_origen = data.region_origen;
            empleado.acompanantes = data.acompanantes;
            empleado.observaciones = data.observaciones;
            empleado.usuario_modificacion = user;

            await this.empleadoRepository.save(empleado);

            return createApiResponse<EmpleadoResponseDto>(true, 'Empleado actualizado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al actualizar el Empleado');
        }
    }

    // Eliminar Empleado 
    async deleteEmpleado(id: number): Promise<ApiResponse<any>> {
        try {
            const empleado = await this.empleadoRepository.findOne({ where: { id: id } });

            if (!empleado) {
                throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
            }

            await this.empleadoRepository.delete(empleado);

            return createApiResponse<EmpleadoResponseDto>(true, 'Empleado eliminado correctamente', null, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al eliminar el Empleado');
        }
    }
    // EMPLEADOS

    async getTipoEmpleado(): Promise <ApiResponse<itemsResponseDto[]>> {
        try {
            const tipoEmpleado = await this.tipoEmpleadoRepository.find({ where: { activo: true } });

            const response = tipoEmpleado.map(clasificacion => ({
                id: clasificacion.id,
                nombre: clasificacion.nombre,
            }));

            return createApiResponse<itemsResponseDto[]>(true, 'Lista de tipos de empleado obtenida correctamente', response, null, HttpStatus.OK);
        } catch (error) {
            throw new InternalServerErrorException('Error al acceder la lista de clasificiacion de productos');
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

}
