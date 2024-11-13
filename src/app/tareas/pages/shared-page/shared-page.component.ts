import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { SharedTasksService } from '../../service/shared-tasks.service';
import { TaskService } from '../../service/task.service';
import { MaterialModule } from '../../../material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { ShareTaskDialogComponent } from '../../components/share-task-dialog/share-task-dialog.component';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './shared-page.component.html',
  styleUrl: './shared-page.component.css',
})
export class SharedPageComponent implements OnInit {
  private shared_list = signal<Task[]>([]);
  private sharedTaskService = inject(SharedTasksService);
  private TaskService = inject(TaskService);

  sharedList = computed(() => this.shared_list());

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.sharedTaskService.getList().subscribe((tasks) => {
      this.shared_list.set(tasks);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ShareTaskDialogComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El modal fue cerrado');
      console.log('Resultado:', result);
    });
  }
}
