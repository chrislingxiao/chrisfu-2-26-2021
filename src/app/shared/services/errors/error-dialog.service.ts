import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class ErrorDialogService {
  private opened = false;

  constructor(private message: NzMessageService) {}

  openDialog(message: string): void {
    if (!this.opened) {
      this.opened = true;
      this.message.create('error', `${message}`, { nzDuration: 3000 });
    }
  }
}
