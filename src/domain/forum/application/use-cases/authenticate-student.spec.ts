
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeEncrypter: FakeEncrypter
let fakerHasher: FakeHasher
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeEncrypter = new FakeEncrypter()
    fakerHasher = new FakeHasher()
    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakerHasher, fakeEncrypter)
  })
  
  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakerHasher.hash('123456')
    })

    inMemoryStudentsRepository.items.push(student)

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '123456'
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String)
    })
  })
})