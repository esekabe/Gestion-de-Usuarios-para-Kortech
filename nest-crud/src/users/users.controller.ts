import { Body, Controller, Delete, Get, Param, Patch, Post, ParseUUIDPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Crear un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 409, description: 'La cédula ya existe' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener todos los usuarios'})
  @ApiResponse({ status: 200, description: 'Lista de usuarios activos'})
  @Get()
  getAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Obtener usuarios eliminados'})
  @ApiResponse({ status: 200, description: 'Lista de usuarios eliminados'})
  @Get('deleted')
  findDeleted() {
    return this.usersService.findDeleted();
  }

  @ApiOperation({ summary: 'Obtener detalles de un usuario por ID'})
  @ApiParam({ name: 'id', description: 'UUID del usuario'})
  @ApiResponse({ status: 200, description: 'Detalles del usuario'})
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Editar un usuario'})
  @ApiParam({ name: 'id', description: 'UUID del usuario'})
  @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente'})
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ){
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Eliminar un usuario (Soft Delete)'})
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario desactivado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Restaurar un usuario (Soft Delete)'})
  
  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }
  
}
