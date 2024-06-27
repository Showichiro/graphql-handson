import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CountByCompany {
  @Field(() => String)
  companyCode: string;
  @Field(() => Int)
  count: number;
}
