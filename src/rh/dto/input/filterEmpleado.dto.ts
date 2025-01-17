import { ApiProperty } from '@nestjs/swagger';

export class filterEmpleadoDto {

    @ApiProperty({ description: 'Id tipo de Empleado', example: '1' })
    idTipoEmpleado: number;

    @ApiProperty({ description: 'Nombre de Empleado', example: 'azucar' })
    nombreEmpleado: string;
}