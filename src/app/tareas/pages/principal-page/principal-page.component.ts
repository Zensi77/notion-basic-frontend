import { Component } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { DragDropComponent } from '../../components/drag-drop/drag-drop.component';

@Component({
  standalone: true,
  imports: [TaskListComponent, DragDropComponent],
  templateUrl: './principal-page.component.html',
  styleUrl: './principal-page.component.css',
})
export class PrincipalPageComponent {}
