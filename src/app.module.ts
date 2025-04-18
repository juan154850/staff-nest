import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [PrismaModule, CompanyModule, UserModule, RequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
