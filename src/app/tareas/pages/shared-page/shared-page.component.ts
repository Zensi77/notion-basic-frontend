import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

import { Task } from '../../interfaces/task.interface';
import { SharedTasksService } from '../../service/shared-tasks.service';
import { TaskService } from '../../service/task.service';
import { MaterialModule } from '../../../material/material.module';
import { ShareTaskDialogComponent } from '../../components/share-task-dialog/share-task-dialog.component';
import { listShared } from '../../interfaces/sharedTask.interface';
import { sign } from 'crypto';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './shared-page.component.html',
  styleUrl: './shared-page.component.css',
})
export class SharedPageComponent implements OnInit {
  listShared = signal<listShared[]>([]);
  private sharedTaskService = inject(SharedTasksService);
  private taskService = inject(TaskService);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sharedTaskService.getList().subscribe((tasks) => {
      this.listShared.set(tasks);
    });
  }

  openDialog(): void {
    this.dialog.open(ShareTaskDialogComponent, {
      width: '600px',
    });
  }
}
