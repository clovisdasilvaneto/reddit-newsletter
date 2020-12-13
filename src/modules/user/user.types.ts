import {
  IsEmail,
  IsBoolean,
  IsString,
  ValidateIf,
  IsArray,
} from 'class-validator';

export interface UserBody {
  password: string;
  name: string;
  email: string;
  subscribed: boolean;
  channels?: string[];
}

export interface User extends UserBody {
  id: string;
}

export class CreateUserValidator {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsBoolean()
  subscribed: boolean;
}

export class UpdateUserValidator {
  @ValidateIf((data) => data.name)
  @IsEmail()
  email: string;

  @ValidateIf((data) => data.password)
  @IsString()
  password: string;

  @ValidateIf((data) => data.name)
  @IsString()
  name: string;

  @ValidateIf((data) => data.subscribed)
  @IsBoolean()
  subscribed: boolean;

  @ValidateIf((data) => data.channels)
  @IsArray()
  channels: string[];
}
