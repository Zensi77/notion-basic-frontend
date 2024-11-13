import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../service/websocket.service';
import { NbChatModule, NbFocusMonitor } from '@nebular/theme';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'chat-shared',
  standalone: true,
  imports: [CommonModule, NbChatModule],
  providers: [NbFocusMonitor],
  templateUrl: './chat-shared.component.html',
  styleUrl: './chat-shared.component.css',
})
export class ChatSharedComponent implements OnDestroy {
  private websocketService = inject(WebsocketService);
  mensajes = this.websocketService.mensajes;
  newMensaje: string = '';

  private mensajesSubscription!: Subscription;

  mandarMensaje(mensaje: string) {
    this.websocketService.sendMessage(this.newMensaje);
    this.newMensaje = '';
  }

  ngOnDestroy(): void {
    if (this.mensajesSubscription) {
      this.mensajesSubscription.unsubscribe();
    }
    this.websocketService.closeConnection();
  }
}
