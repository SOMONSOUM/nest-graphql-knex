import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { Token } from './schema';
import { RegisterAuthDto } from './dto/register.dto';
import { PasswordService } from '../../utils/password.service';
import { UserService } from '../user/user.service';
import { User } from '../user/schema';
import { GraphQLError } from 'graphql';
import { ERROR_MESSAGES } from 'src/common/errors/errorMessages';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly userService: UserService,
  ) {}

  async createUser(payload: RegisterAuthDto): Promise<Token> {
    const { ...user } = payload;

    const hashedPassword = await this.passwordService.hashPassword(
      user.password,
    );

    user.password = hashedPassword;

    try {
      const existedUser = await this.userService.getUserByEmail(payload.email);
      if (existedUser) {
        throw new GraphQLError(ERROR_MESSAGES.CONFLICT, {
          extensions: {
            code: HttpStatus.CONFLICT,
          },
        });
      }

      const userId = await this.userService.createUser(user);
      if (!userId) {
        throw new GraphQLError('Error creating user');
      }
      return this.generateTokens({
        userId: userId,
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      throw new GraphQLError('Invalid credentials', {
        extensions: {
          code: HttpStatus.BAD_REQUEST,
        },
      });
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password,
    );

    if (!passwordValid) {
      throw new GraphQLError('Invalid credentials', {
        extensions: {
          code: HttpStatus.UNAUTHORIZED,
        },
      });
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new GraphQLError(ERROR_MESSAGES.NOT_FOUND, {
        extensions: {
          code: HttpStatus.NOT_FOUND,
        },
      });
    }
    return user;
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.validateUser(id);
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
