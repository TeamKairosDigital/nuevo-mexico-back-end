import { ApiProperty } from '@nestjs/swagger';

export class createVentaDto {

    @ApiProperty({ description: 'Id', example: '1' })
    id?: number;

    @ApiProperty({ description: 'id empleado', example: '2' })
    empleado_id: number;

    @ApiProperty({ description: 'Id usuario', example: '2' })
    idUsuario: number;

    @ApiProperty({ description: 'lista de productos', example: '2' })
    listaProductos: listaProductos[];

}

export class listaProductos {

    @ApiProperty({ description: 'id producto', example: '2' })
    producto_id: number;

    @ApiProperty({ description: 'cantidad', example: '1' })
    cantidad: number;

    @ApiProperty({ description: 'monto Total', example: '1' })
    montoTotal: number;

    @ApiProperty({ description: 'monto Total', example: '1' })
    pagoEfectivo: number;

}