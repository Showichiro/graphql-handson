import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../user/models/user.model';
import {
  AppUserEntityControllerService,
  AppUserSearchControllerService,
  EntityModelAppUser,
} from 'src/generated';
import { map, Observable } from 'rxjs';
import { UserArgs } from './models/users.args';
import { CreateUserInput } from './models/createUser.input';
import { CountByCompany } from './models/countByCompany.model';
import { AxiosResponse } from 'axios';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly userService: AppUserEntityControllerService,
    private readonly userSearchService: AppUserSearchControllerService,
  ) {}
  @Query(() => [User])
  public users(@Args() args: UserArgs): Observable<EntityModelAppUser[]> {
    return this.userService
      .getCollectionResourceAppuserGet1(args.page, args.size, args.sort)
      .pipe(
        map((res) => res.data),
        map((v) => v._embedded.appUsers),
      );
  }

  @Query(() => User, { nullable: true })
  public findUserById(@Args('id') id: string): Observable<EntityModelAppUser> {
    return this.userService
      .getItemResourceAppuserGet(id)
      .pipe(map((res) => res.data));
  }

  @Mutation(() => User)
  public createUser(
    @Args('user') user: CreateUserInput,
  ): Observable<EntityModelAppUser> {
    return this.userService
      .postCollectionResourceAppuserPost({
        userId: user.id,
        age: user.age,
        companyCode: user.companyCode,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .pipe(map((res) => res.data));
  }

  @Query(() => [CountByCompany])
  public userCountByCompanyCode() {
    return this.getUserCountByCompanyCode().pipe(
      map((res) => {
        return res.data;
      }),
      map((v) =>
        v.map(([companyCode, count]) => ({
          companyCode,
          count,
        })),
      ),
    );
  }

  // 明らかにバッドノウハウだけど戻りの型だけ変更したprivateメソッドでラップすればProjectionもまぁ
  private getUserCountByCompanyCode(): Observable<
    AxiosResponse<[string, number][]>
  >;

  private getUserCountByCompanyCode(): Observable<any> {
    return this.userSearchService.executeSearchAppuserGet2();
  }
}
