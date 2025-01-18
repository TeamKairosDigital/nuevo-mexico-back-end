import { ApiProperty } from '@nestjs/swagger';

export class filterVentaDto {
    @ApiProperty({ description: 'código de inventario', example: '123' })
    idEmpleado: number;

    @ApiProperty({ description: 'Id clasificación de inventario', example: '1' })
    idProducto: number;

    @ApiProperty({ description: 'Id producto de inventario', example: 'azucar' })
    fechaInicio: string;

    @ApiProperty({ description: 'Id unidad de inventario', example: '2' })
    FechaFin: string;
}