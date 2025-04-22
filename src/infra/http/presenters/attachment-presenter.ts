import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class AttachmentPresenter {

  static toHTTP(attachmet: Attachment) {
    return {
      id: attachmet.id.toString(),
      url: attachmet.url,
      title: attachmet.title
    }
  }

}