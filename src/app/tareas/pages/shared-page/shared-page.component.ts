import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SharedTasksService } from '../../service/shared-tasks.service';
import { TaskService } from '../../service/task.service';
import { MaterialModule } from '../../../material/material.module';
import { ShareTaskDialogComponent } from '../../components/share-task-dialog/share-task-dialog.component';
import { listShared } from '../../interfaces/sharedTask.interface';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './shared-page.component.html',
  styleUrl: './shared-page.component.css',
})
export class SharedPageComponent implements OnInit {
  listShared = signal<listShared[]>([]);
  private sharedTaskService = inject(SharedTasksService);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sharedTaskService.getList().subscribe((tasks) => {
      this.listShared.set(tasks);
      console.log(tasks);
    });
  }

  openDialog(): void {
    this.dialog.open(ShareTaskDialogComponent, {
      width: '600px',
    });
  }
}
