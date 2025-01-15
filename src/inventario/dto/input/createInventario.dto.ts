import { ApiProperty } from '@nestjs/swagger';

export class createInventarioDto {

    @ApiProperty({ description: 'Id de inventario', example: '1' })
    id?: number;

    @ApiProperty({ description: 'código de inventario', example: '123' })
    codigo: string;

    @ApiProperty({ description: 'Clasificación de inventario', example: '1' })
    idClasificacionProducto: number;

    @ApiProperty({ description: 'Id producto de inventario', example: 'azucar' })
    nombre_producto: string;

    @ApiProperty({ description: 'unidad de inventario', example: '2' })
    idUnidad: number;

    @ApiProperty({ description: 'inventario inicial', example: '2' })
    inventario_inicial: number;

    @ApiProperty({ description: 'inventario inicial', example: '2' })
    costo_inicial: number;

    @ApiProperty({ description: 'cantidad actual', example: '2' })
    cantidad_actual?: number;

    @ApiProperty({ description: 'cantidad actual', example: '2' })
    precio_actual?: number;

    @ApiProperty({ description: 'Id usuario', example: '2' })
    idUsuario: number;

}