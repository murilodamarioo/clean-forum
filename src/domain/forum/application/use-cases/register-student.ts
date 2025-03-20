import { Student } from '../../enterprise/entities/student'
import { HashGenerator } from '../cryptography/hash-generator'
import { StudentsRepository } from '../repositories/students-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentAlreadyExistsError } from './errors/student-already-exists-error'


interface ResgiterStudentUseCaseRequest {
  name: string,
  email: string,
  password: string
}

type ResgiterStudentUseCaseResponse = Either<StudentAlreadyExistsError, { student: Student }>

@Injectable()
export class ResgiterStudentUseCase {
  constructor(private studentsRepository: StudentsRepository, private hashGenerator: HashGenerator) {}
 
  async execute({ name, email, password }: ResgiterStudentUseCaseRequest): Promise<ResgiterStudentUseCaseResponse> {
    const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

    if(studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)
    
    const student = Student.create({
      name,
      email,
      password: hashedPassword
    })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}