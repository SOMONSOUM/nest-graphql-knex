import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class RegisterAuthDto {
  // User fields
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @MinLength(4)
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @IsOptional()
  first_name: string;

  @Field()
  @IsString()
  @IsOptional()
  last_name: string;
}
