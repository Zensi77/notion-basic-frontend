import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AuthService } from '../../auth/services/auth.service';

interface Mensaje {
  userName: string;
  text: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private authService = inject(AuthService);

  // WebSocketSubject es una clase que representa un flujo de mensajes de WebSocket abierto.
  private socket = new WebSocketSubject<any>(
    `ws://localhost:8000/ws/${this.authService.currentUser.name}/`
  );

  // Un BehaviorSubject es un tipo de Subject, especial en el sentido de que mantiene un valor actual y lo emite a cualquier suscriptor en el momento en que se suscribe.
  // es decir, el BehaviorSubject necesita un valor inicial y siempre emite el valor actual a un nuevo suscriptor.
  // por lo que actualiza la lista de mensajes en tiempo real
  private mensajesSubject = new BehaviorSubject<Mensaje[]>([]);

  mensajes = this.mensajesSubject.asObservable();

  constructor() {
    this.socket.subscribe({
      next: (mensajes) => this.recibirMensaje(mensajes),
      error: (error) => error,
    });
  }

  sendMessage(mensaje: string) {
    const usuarioNombre = this.authService.currentUser()?.name;
    const timestamp = new Date();
    const msg = { userName: usuarioNombre!, text: mensaje, timestamp };

    this.socket.next(msg);
  }

  private recibirMensaje(data: any) {
    const messages = this.mensajesSubject.getValue();
    messages.push({
      userName: data.name,
      text: data.text,
      timestamp: new Date(),
    });
    this.mensajesSubject.next(messages);
  }

  closeConnection() {
    this.socket.complete();
  }
}
