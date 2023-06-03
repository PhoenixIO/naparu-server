import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as mkcert from 'mkcert';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { NestFactory } from '@nestjs/core';
import { NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './exceptionFactory';
import { AppModule } from './app.module';

async function bootstrap() {
  const options: NestApplicationOptions = {};
  if (process.env.USE_SSL == 'TRUE') {
    const ca = await mkcert.createCA({
      organization: 'PhoenixIO',
      countryCode: 'UA',
      state: 'Vinnitsia',
      locality: 'Vinnitsia',
      validityDays: 365,
    });
    
    // then create a tls certificate
    const cert = await mkcert.createCert({
      domains: ['127.0.0.1', 'localhost', '93.77.59.212'],
      validityDays: 365,
      caKey: ca.key,
      caCert: ca.cert
    });

    options.httpsOptions = {
      // key: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.key')),
      // cert: fs.readFileSync(path.resolve(__dirname, '../ssl/cert.crt')),
      key: cert.key,
      cert: cert.cert,
    };
  }

  const app = await NestFactory.create(AppModule, options);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    methods: ['GET', 'POST', 'DELETE'],
    origin: (origin, callback) => callback(null, true),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  app.use(
    session({
      secret: process.env.JWT_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);
  console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
