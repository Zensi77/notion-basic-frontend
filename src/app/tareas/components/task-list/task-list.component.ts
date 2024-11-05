import { Component, inject } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIcon, MatDivider],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  private taskService = inject(TaskService);

  public tasks = this.taskService.taskList();

  sortBy(property: string) {
    this.taskService.sortBy(property);
  }

  completeTask(item: Task) {}
}
