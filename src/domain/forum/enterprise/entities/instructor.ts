import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface InstructorProps {
  name: string
}

export class Instrcutor extends Entity<InstructorProps> {

  static create(props: InstructorProps, id?: UniqueEntityID) {
    const instructor = new Instrcutor(props, id)

    return instructor
  }

}