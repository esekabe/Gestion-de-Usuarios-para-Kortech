import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByCedulaWithContrasena(
      loginDto.cedula,
    );

    if (!user || !(await bcrypt.compare(loginDto.contrasena, user.contrasena))) {
      throw new UnauthorizedException('Cédula o contraseña incorrecta');
    }

    return {
      message: 'Inicio de sesión exitoso',
      user: this.usersService.withoutPassword(user),
    };
  }
}
