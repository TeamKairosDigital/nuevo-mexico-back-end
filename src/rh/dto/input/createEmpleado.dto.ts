import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpleadoDto {

    @ApiProperty({ description: 'Id de empleado', example: '1' })
    id?: number;

    @ApiProperty({ description: 'Tipo de empleado', example: '123' })
    codigo_empleado: string;

    @ApiProperty({ description: 'Tipo de empleado', example: '123' })
    idTipoEmpleado: number;

    @ApiProperty({ description: 'Nombre de empleado', example: '1' })
    nombre_Empleado: string;

    @ApiProperty({ description: 'Teléfono de empleado', example: 'azucar' })
    telefono: string;

    @ApiProperty({ description: 'region/origen de empleado', example: '2' })
    region_origen: string;

    @ApiProperty({ description: 'Acompañantes empleado', example: '2' })
    acompanantes: number;

    @ApiProperty({ description: 'observaciones empleado', example: '2' })
    observaciones: string;

    @ApiProperty({ description: 'idUsuario', example: '2' })
    idUsuario: number;

}