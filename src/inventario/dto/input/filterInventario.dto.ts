import { ApiProperty } from '@nestjs/swagger';

export class filterInventarioDto {
    @ApiProperty({ description: 'código de inventario', example: '123' })
    codigo: string;

    @ApiProperty({ description: 'Id clasificación de inventario', example: '1' })
    idClasificacionProducto: number;

    @ApiProperty({ description: 'Id producto de inventario', example: 'azucar' })
    nombreProducto: string;

    @ApiProperty({ description: 'Id unidad de inventario', example: '2' })
    idUnidad: number;
}