import { Module } from '@nestjs/common';
import { CompaniesResolver } from './companies/companies.resolver';
import { CompanyResolver } from './company/company.resolver';
import { UserResolver } from './user/user.resolver';
import { UsersResolver } from './users/users.resolver';
import { CompanyService } from './user/dataloader/company/company.service';

@Module({
  providers: [
    CompaniesResolver,
    CompanyResolver,
    UsersResolver,
    UserResolver,
    CompanyService,
  ],
})
export class GraphqlModule {}
