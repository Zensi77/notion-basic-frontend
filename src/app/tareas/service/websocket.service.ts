import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private authService = inject(AuthService);

  // WebSocketSubject es una clase que representa un flujo de mensajes de WebSocket abierto.
  private socket: WebSocketSubject<any>;

  constructor() {
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      this.socket = new WebSocketSubject<any>(
        `ws://localhost:8000/ws/${currentUser.name}`
      );
    } else {
      throw new Error('No hay usuario logueado');
    }
  }

  sendMessage(mensaje: any) {
    this.socket.next(JSON.stringify(mensaje));
  }

  getMessage(): Observable<any> {
    return this.socket.asObservable();
  }

  closeConnection() {
    this.socket.complete();
  }
}
