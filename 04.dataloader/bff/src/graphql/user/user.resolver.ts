import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './models/user.model';
import { EntityModelAppUser, EntityModelCompany } from 'src/generated';
import { Company } from 'src/graphql/company/models/company.model';
import { CompanyService } from './dataloader/company/company.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    // 元々はバックエンドAPIを呼び出すServiceクラスを直呼びしていたが、Dataloaderのサービスクラスを呼ぶようにする.
    // private readonly companyService: CompanyEntityControllerService,
    private readonly companyService: CompanyService,
  ) {}

  @ResolveField(() => String)
  public id(@Parent() parent: EntityModelAppUser): string {
    return parent.userId;
  }

  @ResolveField(() => String)
  public name(@Parent() parent: EntityModelAppUser): string {
    return `${parent.lastName} ${parent.firstName}`;
  }

  @ResolveField(() => Company)
  public async company(
    @Parent() parent: EntityModelAppUser,
  ): Promise<EntityModelCompany> {
    // User.companyCodeでDataloaderを呼ぶ.
    const company = await this.companyService.load(parent.companyCode);
    return company;
  }
}
