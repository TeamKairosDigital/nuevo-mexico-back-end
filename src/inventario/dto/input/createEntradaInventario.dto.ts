import { ApiProperty } from '@nestjs/swagger';

export class createEntradaInventarioDto {

    @ApiProperty({ description: 'Id de inventario', example: '1' })
    id?: number;

    @ApiProperty({ description: 'cantidad actual', example: '2' })
    entrada?: number;

    @ApiProperty({ description: 'cantidad actual', example: '2' })
    costo?: number;

    @ApiProperty({ description: 'Id producto', example: '1' })
    id_producto?: number;

    @ApiProperty({ description: 'Id usuario', example: '2' })
    idUsuario: number;

}