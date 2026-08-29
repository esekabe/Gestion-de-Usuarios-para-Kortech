import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: {
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('includes the password when finding a user for login', async () => {
    const user = { cedula: '123456', contrasena: 'hashed-password' } as User;
    const queryBuilder = {
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };
    repository.createQueryBuilder.mockReturnValue(queryBuilder);

    await expect(service.findByCedulaWithContrasena(user.cedula)).resolves.toBe(user);
    expect(repository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(queryBuilder.addSelect).toHaveBeenCalledWith('user.contrasena');
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'user.cedula = :cedula',
      { cedula: user.cedula },
    );
  });
});
