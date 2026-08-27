import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;
    
    @IsNotEmpty()
    @IsString()
    cedula: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    contrasena: string;
    
}