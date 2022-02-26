import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showStandard(text: string) {
    this.show(text);
  }

  showSuccess(text: string) {
    this.show(text, { classname: 'bg-success text-light' });
  }

  showDanger(text: string) {
    this.show(text, { classname: 'bg-danger text-light' });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
