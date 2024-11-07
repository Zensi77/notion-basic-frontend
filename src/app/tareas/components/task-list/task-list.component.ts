import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TaskService } from '../../service/task.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatDivider],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  public tasks = this.taskService.tasks();

  sortBy(property: string) {
    this.animacionOrdenacion();
    this.taskService.sortBy(property);
  }

  animacionOrdenacion(): boolean {
    return true;
  }

  completeTask(item: Task) {}
}
