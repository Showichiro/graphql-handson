import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, MaxLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @MaxLength(6, { message: 'idは6桁までで設定して下さい。'})
  id: string;
  @Field(() => String)
  firstName: string;
  @Field(() => String)
  lastName: string;
  @Field(() => Int)
  age: number;
  @Field(() => String)
  @IsEmail({}, { message: 'Emailの形式が正しくありません。' })
  email: string;
  @Field(() => String)
  companyCode: string;
}
