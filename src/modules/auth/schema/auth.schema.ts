import { ObjectType } from '@nestjs/graphql';
import { Token } from './token.schema';
import { User } from 'src/modules/user/schema';

@ObjectType()
export class Auth extends Token {
  user: User;
}
