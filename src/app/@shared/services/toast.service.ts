import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any = [];

  success(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-success text-light' });
  }

  danger(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-danger text-light' });
  }

  info(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-info text-light' });
  }

  warring(msg: string) {
    this.toasts.push({ textOrTpl: msg, className: 'bg-warning text-light' });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
