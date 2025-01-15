import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000);

  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200',
    // 'http://localhost:3000/api'
  ];

  // Habilitar CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Registro global del filtro
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuración de Swagger
  const config = new DocumentBuilder()
  .setTitle('Finca API')
  .setDescription('Servicios API de Finca')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  
  await app.listen(parseInt(process.env.PORT) || 3000);

}
bootstrap();
