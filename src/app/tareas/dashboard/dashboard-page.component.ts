import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { AuthService } from '../../auth/services/auth.service';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../service/websocket.service';

interface MenuItems {
  title: string;
  icon: string;
  route: string;
}

@Component({
  standalone: true,
  imports: [RouterModule, RouterLink, MaterialModule, CommonModule],
  templateUrl: './dashboard-page.component.html',
  styles: ``,
})
export class DashboardPageComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private ws = inject(WebsocketService);

  user = computed(() => this.authService.currentUser());

  sidebarItems: MenuItems[] = [
    {
      title: 'Tareas',
      icon: 'task',
      route: './tasks',
    },
    {
      title: 'Tareas compartidas',
      icon: 'shared_task',
      route: './sharedTasks',
    },
  ];

  ngOnInit(): void {
    this.ws.getMessage().subscribe((msg) => {
      console.log('Mensaje recibido: ', msg);
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['/auth/login']);
  }
}
