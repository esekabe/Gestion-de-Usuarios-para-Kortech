import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Not, IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'contrasena'>> {
        const { cedula, contrasena } = createUserDto;
        const existingUser = await this.userRepository.findOne({ where: { cedula } });

        if (existingUser) {
            throw new ConflictException('Usuario con la cédula proporcionada ya existe');
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const newUser = this.userRepository.create({
            ...createUserDto,
            contrasena: hashedPassword,
        });

        const savedUser = await this.userRepository.save(newUser);
        return this.withoutPassword(savedUser);
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: { id: true, nombre: true, apellido: true, cedula: true, createdAt: true, updatedAt: true },
        });
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id },
            select: { id: true, nombre: true, apellido: true, cedula: true, createdAt: true, updatedAt: true },
        })

        if(!user) {
            throw new NotFoundException('Usuario no encontrado');
        }

        return user;
    }

    async findByCedulaWithContrasena(cedula: string): Promise<User | null> {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.contrasena')
            .where('user.cedula = :cedula', { cedula })
            .getOne();
    }

    withoutPassword(user: User): Omit<User, 'contrasena'> {
        const { contrasena: _contrasena, ...publicUser } = user;
        return publicUser;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'contrasena'>> {

        if (updateUserDto.contrasena){
            updateUserDto.contrasena = await bcrypt.hash(updateUserDto.contrasena, 10);
        }

        const updatedUser = await this.userRepository.preload({
            id,
            ...updateUserDto,
        });
        if (!updatedUser) {
            throw new NotFoundException('Usuario no encontrado');
        }
        const savedUser = await this.userRepository.save(updatedUser);
        return this.withoutPassword(savedUser);
    }

    async remove(id: string): Promise<{message: string}> {

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuario no encontrado');
        }
        await this.userRepository.softRemove(user);
        return { message: `Usuario con ID ${id} desactivado correctamente` };
    }

    async restore(id: string): Promise<{message: string}> {
        const result = await this.userRepository.restore(id);

        if (!result.affected){
            throw new NotFoundException('Usuario no encontrado');
        }

        return { message: `Usuario con ID ${id} restaurado correctamente`};
    }

    async findDeleted(): Promise<User[]> {
        return this.userRepository.find({
            withDeleted: true,
            where: {
            deletedAt: Not(IsNull()),
            },
            select: {
            id: true,
            nombre: true,
            apellido: true,
            cedula: true,
            deletedAt: true,
            },
        });
    }


}
