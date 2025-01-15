import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { createApiResponse } from 'src/common/response/createApiResponse';
import * as bcrypt from 'bcrypt';
import { User } from './entities/auth-user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { loginResponseDto } from './dto/Output/loginResponse.dto';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly UsersRepository: Repository<User>,
    ) { }

    async validateUser(username: string, password: string): Promise<ApiResponse<loginResponseDto>> {

        const user = await this.findByUsername(username);
        if (!user) {
            // Lanzar excepción 404 si el usuario no se encuentra
            throw new NotFoundException('Usuario no encontrado');
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.pass_hash);
        if (!isPasswordValid) {
            // Lanzar excepción 401 si la contraseña es incorrecta
            throw new UnauthorizedException('Contraseña incorrecta');
        }

        const payload = { username: user.user_name, userid: user.id };
        const token = await this.jwtService.signAsync(payload);
    
        const userDataDto = new loginResponseDto();
        userDataDto.id = user.id;
        userDataDto.username = user.user_name;
        userDataDto.nombre = user.nombre;
        userDataDto.access_token = token;
    
        // Devolver la respuesta de éxito
        return createApiResponse(true, 'Usuario autenticado correctamente', userDataDto, null, HttpStatus.OK);
    }
    
      
    
    //GENERATE JWT TOKEN
    async generateJwtToken(userId: number): Promise<string> {

        const secret = this.configService.get<string>('JWT_SECRET');
        return this.jwtService.signAsync(
            { userId },
            { secret, expiresIn: '1h' },
        );

    }



    // Método para encontrar un usuario por su nombre de usuario
    private async findByUsername(UserName: string, relations: string[] = []): Promise<User | undefined> {
        try {
            const user = await this.UsersRepository.findOne({
                where: { user_name: UserName },
                relations: relations.length > 0 ? relations : undefined,  // Cargar las relaciones necesarias
            });
            if (!user) {
                console.warn(`No user found with username: ${UserName}`);
            }
            return user;
        } catch (error) {
            console.error('Error finding user by username:', error);
            throw error;
        }
    }

    
}
