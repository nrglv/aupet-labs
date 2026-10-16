/** DIP: абстракция, от которой зависят и высокоуровневый, и низкоуровневые модули. */
export interface MessageSender {
  send(message: string): void;
}

export class EmailService implements MessageSender {
  send(message: string): void {
    console.log(`Отправка Email: ${message}`);
  }
}

export class SmsService implements MessageSender {
  send(message: string): void {
    console.log(`Отправка SMS: ${message}`);
  }
}

/**
 * Высокоуровневый модуль. Не создает EmailService сам, а получает
 * любую реализацию MessageSender через конструктор (внедрение зависимости).
 */
export class Notification {
  constructor(private readonly sender: MessageSender) {}

  send(message: string): void {
    this.sender.send(message);
  }
}
