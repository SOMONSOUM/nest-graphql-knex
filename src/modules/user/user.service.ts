import { Inject, Injectable } from '@nestjs/common';
import { User } from './schema';
import { CreateUserDto } from './dto/createUser.dto';
import { KNEX_CONNECTION } from '../knex/database.provider';
import { Knex } from 'knex';

@Injectable()
export class UserService {
  constructor(
    @Inject(KNEX_CONNECTION)
    private readonly knex: Knex,
  ) {}
  async getUserById(id: number): Promise<User> {
    const user = await this.knex
      .table<User>('users')
      .select()
      .where('id', '=', id)
      .first();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.knex.table<User>('users').select('*');
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.knex
      .table('users')
      .select('*')
      .where('email', '=', email)
      .first();

    return user;
  }

  async createUser(user: CreateUserDto): Promise<number> {
    const [createdUser] = await this.knex.table('users').insert(user);
    return createdUser;
  }
}
