import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  created_at?: Date = new Date();

  @Field()
  updated_at?: Date = new Date();
}
