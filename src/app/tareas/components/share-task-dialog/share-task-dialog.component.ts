import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../service/task.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SharedTasksService } from '../../service/shared-tasks.service';
import { SharedTask } from '../../interfaces/sharedTask.interface';
import { catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { nextTick } from 'process';
import { MatDialogRef } from '@angular/material/dialog';
import { sign } from 'crypto';
import { WebsocketService } from '../../service/websocket.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-share-task-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormsModule],
  templateUrl: './share-task-dialog.component.html',
  styles: ``,
})
export class ShareTaskDialogComponent implements OnInit {
  private taskService = inject(TaskService);
  private authService = inject(AuthService);
  private ws = inject(WebsocketService);

  searchInput = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.email, Validators.required]);
  selectedTask?: Task;

  listOfTasks = this.taskService.taskList();
  listFiltered = signal<Task[]>([]);

  constructor(private dialogRef: MatDialogRef<ShareTaskDialogComponent>) {}

  ngOnInit() {
    // Llama a getTasks y espera a que cargue
    this.taskService.getTasks();
    // Espera un poco para que se carguen las tareas en el servicio y luego inicializo el filtro
    setTimeout(() => {
      this.listOfTasks = this.taskService.taskList();
      this.listFiltered.set(this.listOfTasks);
    }, 200);
  }

  searchTask() {
    const value: string = this.searchInput.value || '';

    this.listFiltered.set(
      this.listOfTasks.filter((item) => item.title.includes(value))
    );
  }

  onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.listOfTasks = [];
      return;
    }

    const task: Task = event.option.value;
    this.searchInput.setValue(task.title);

    this.selectedTask = task;
  }

  share() {
    if (this.searchInput.invalid && this.email.invalid) {
      this.searchInput.markAllAsTouched;
      this.email.markAllAsTouched;
      return;
    }

    if (!this.selectedTask || !this.email.value) {
      return;
    }

    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return;
    }

    const invitacion = {
      from: currentUser.name,
      to: this.email.value,
      task: this.selectedTask.title,
    };
    this.ws.sendMessage(invitacion);

    //const data: SharedTask = {
    //  task_id: this.selectedTask.id,
    //  email: this.email.value,
    //};
    //
    //this.sharedService.shareTask(data).subscribe({
    //  next: () => {
    //    Swal.fire('Compartido', 'Tarea compartida con éxito', 'success'),
    //      this.dialogRef.close();
    //  },
    //  error: (err) => {
    //    Swal.fire(
    //      'Error',
    //      'El email introducido no corresponde con ningun usuario',
    //      'error'
    //    );
    //    return of(null);
    //  },
    //});
  }
}
