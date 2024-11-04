import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { User } from '../../auth/interfaces/user.interfaces';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

interface MenuItems {
  title: string;
  icon: string;
  route: string;
}

@Component({
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard-page.component.html',
  styles: ``,
})
export class DashboardPageComponent {
  private router = inject(Router);

  user = signal<User | undefined>({
    name: 'Juanma',
  });

  sidebarItems: MenuItems[] = [
    {
      title: 'Tareas',
      icon: 'task',
      route: './tasks',
    },
    {
      title: 'Estadísticas',
      icon: 'query_stats',
      route: './stats',
    },
  ];

  logOut() {
    this.user.set(undefined);
    this.router.navigate(['/auth/login']);
  }
}
