import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@gg-tickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
