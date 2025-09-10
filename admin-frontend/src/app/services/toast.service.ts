import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ToastService {
    constructor(private messageService: MessageService) { }

    success(message: string) {
        this.messageService.add({ severity: 'success', summary: '', detail: message });
    }

    error(message: string) {
        this.messageService.add({ severity: 'error', summary: '', detail: message });
    }

    info(message: string) {
        this.messageService.add({ severity: 'info', summary: '', detail: message });
    }

    warn(message: string) {
        this.messageService.add({ severity: 'warn', summary: '', detail: message });
    }

    clear() {
        this.messageService.clear();
    }
}

