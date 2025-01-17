import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './constants/jwt.strategy';
import { AuthGuard } from './guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth-user.entity';
import { Role } from './entities/auth-role.entity';
import { InventarioModule } from 'src/inventario/inventario.module';
import { RhModule } from 'src/rh/rh.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Asegura que las variables de entorno estén disponibles globalmente
        }),
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                return {
                    secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
            inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([User, Role]),
        forwardRef(() => InventarioModule),
        forwardRef(() => RhModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, AuthGuard],
    exports: [JwtModule, AuthService, TypeOrmModule],
})
export class AuthModule {}
