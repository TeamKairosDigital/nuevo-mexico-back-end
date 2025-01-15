import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from 'src/common/response/ApiResponse';
import { createApiResponse } from 'src/common/response/createApiResponse';
import { LoginDto } from './dto/Input/login.dto';
import { loginResponseDto } from './dto/Output/loginResponse.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ) { }

    // LOGIN
    @Post('login')
    async login(@Body() login: LoginDto): Promise<ApiResponse<loginResponseDto>> {
        const response = await this.authService.validateUser(
            login.username,
            login.password,
        );
        return response;
    }
    

}
