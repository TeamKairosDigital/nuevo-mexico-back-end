import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { entradaInventariadoResponseDto, inventarioResponseDto } from './dto/output/inventarioResponse.dto';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { filterInventarioDto } from './dto/input/filterInventario.dto';
import { createInventarioDto } from './dto/input/createInventario.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { itemsResponseDto } from './dto/output/itemsResponse.dto';

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('inventario')
export class InventarioController {

    constructor(
        private inventarioService: InventarioService
    ) { }

    // Lista de inventario
    @Get('getListInventario')
    async getListInventario(@Query() data: filterInventarioDto): Promise<ApiResponse<inventarioResponseDto[]>> {
        const response = await this.inventarioService.getListInventario(data);
        return response;
    }

    // Producto para inventario
    // Crear producto para inventario
    @Post('createInventario')
    async createInventario(@Body() data: createInventarioDto): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.createInventario(data);
        return response
    }

    // Obtener producto por ID
    @Get('getInventarioById/:id')
    async getInventarioById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<inventarioResponseDto>> {
        const response = await this.inventarioService.getInventarioById(id);
        return response
    }

    // Actualizar producto para inventario
    @Put('updateInventario')
    async updateInventario(@Body() data: createInventarioDto): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.updateInventario(data);
        return response
    }

    // Eliminar producto para inventario
    @Delete('deleteInventario/:id')
    async deleteInventario(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.deleteInventario(id);
        return response
    }
    // Producto para inventario

    // Entrada producto
    // Crear entrada producto
    @Post('createEntradaInventario')
    async createEntradaInventario(@Body() data: createInventarioDto): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.createEntradaInventario(data);
        return response
    }

    // Obtener entrada por ID
    @Get('getEntradaInventarioById/:id')
    async getEntradaInventarioById(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<entradaInventariadoResponseDto>> {
        const response = await this.inventarioService.getEntradaInventarioById(id);
        return response
    }

    // Actualizar entrada producto
    @Put('updateEntradaInventario')
    async updateEntradaInventario(@Body() data: createInventarioDto): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.updateEntradaInventario(data);
        return response
    }

    // Eliminar entrada producto
    @Delete('deleteEntradaInventario/:id')
    async deleteEntradaInventario(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<any>> {
        const response = await this.inventarioService.deleteEntradaInventario(id);
        return response
    }
    // Entrada producto


    // Parametros
    // Obtener unidades
    @Get('getUnidades')
    async getUnidades(): Promise<ApiResponse<itemsResponseDto[]>> {
        const response = await this.inventarioService.getUnidades();
        return response;
    }

    // Obtener clasificación de productos
    @Get('getClasificacionProductos')
    async getClasificacionProductos(): Promise<ApiResponse<itemsResponseDto[]>> {
        const response = await this.inventarioService.getClasificacionProductos();
        return response;
    }
    

}
