import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'El username del usuario', example: 'usuario' })
    username: string;

    @ApiProperty({ description: 'La contraseña del usuario', example: 'password123' })
    password: string;
}