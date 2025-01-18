import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RhService } from './rh.service';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { filterEmpleadoDto } from './dto/input/filterEmpleado.dto';
import { EmpleadoResponseDto } from './dto/output/empleadoResponseDto';
import { CreateEmpleadoDto } from './dto/input/createEmpleado.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { itemsResponseDto } from 'src/inventario/dto/output/itemsResponse.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('rh')
export class RhController {

    constructor(
        private rhService: RhService
    ) { }

    // Lista de Empleado
    @Get('getListEmpleado')
    async getListEmpleado(@Query() data: filterEmpleadoDto): Promise<ApiResponse<EmpleadoResponseDto[]>> {
        const response = await this.rhService.getListEmpleado(data);
        return response;
    }

    // Producto para Empleado
    // Crear producto para Empleado
    @Post('createEmpleado')
    async createEmpleado(@Body() data: CreateEmpleadoDto): Promise<ApiResponse<any>> {
        const response = await this.rhService.createEmpleado(data);
        return response
    }

    // Obtener producto por ID
    @Get('getEmpleadoById/:id')
    async getEmpleadoById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<EmpleadoResponseDto>> {
        const response = await this.rhService.getEmpleadoById(id);
        return response
    }

    // Actualizar producto para Empleado
    @Put('updateEmpleado')
    async updateEmpleado(@Body() data: CreateEmpleadoDto): Promise<ApiResponse<any>> {
        const response = await this.rhService.updateEmpleado(data);
        return response
    }

    // Eliminar producto para Empleado
    @Delete('deleteEmpleado/:id')
    async deleteEmpleado(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        const response = await this.rhService.deleteEmpleado(id);
        return response
    }

    @Get('getTipoEmpleado')
    async getTipoEmpleado(): Promise<ApiResponse<itemsResponseDto[]>> {
        const response = await this.rhService.getTipoEmpleado();
        return response;
    }

    @Get('getEmpleados')
    async getEmpleados(): Promise<ApiResponse<itemsResponseDto[]>> {
        const response = await this.rhService.getEmpleados();
        return response;
    }

}
