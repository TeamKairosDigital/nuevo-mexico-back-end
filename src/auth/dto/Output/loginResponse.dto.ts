import { ApiProperty } from '@nestjs/swagger';

export class loginResponseDto {
    @ApiProperty({ description: 'Id del usuario', example: '1' })
    id: number;

    @ApiProperty({ description: 'Username del usuario', example: 'Luis123' })
    username: string;

    @ApiProperty({ description: 'Nombre del usuario', example: 'Luis' })
    nombre: string;

    @ApiProperty({ description: 'Token del usuario', example: 'etc.' })
    access_token: string;
}