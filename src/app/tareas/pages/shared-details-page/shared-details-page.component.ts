import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../service/task.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material/material.module';
import { User } from '../../../auth/interfaces/user.interfaces';
import { ChatSharedComponent } from '../../components/chat-shared/chat-shared.component';

@Component({
  standalone: true,
  imports: [CommonModule, MaterialModule, ChatSharedComponent],
  templateUrl: './shared-details-page.component.html',
  styles: ``,
})
export class SharedDetailsPageComponent implements OnInit {
  private _taskService = inject(TaskService);
  private _activatedRoute = inject(ActivatedRoute);

  taskShared!: Task;
  creator!: User;

  ngOnInit(): void {
    const id_task = this._activatedRoute.snapshot.params['id'];

    this._taskService.getTaskById(id_task).subscribe((res) => {
      this.taskShared = res;
    });

    this._taskService.getUserCreater(id_task).subscribe((res) => {
      this.creator = res;
    });
  }
}
