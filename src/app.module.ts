import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
