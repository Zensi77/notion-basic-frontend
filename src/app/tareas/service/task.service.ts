import { computed, inject, Injectable, signal } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { catchError, of, throwError } from 'rxjs';
import { UUID } from 'crypto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _http = inject(HttpClient);
  private _authService = inject(AuthService);
  private _loading = signal<boolean>(false);
  private _taskList = signal<Task[]>([]);

  user = computed(() => this._authService.currentUser());
  loading = computed(() => this._loading());
  taskList = computed(() => this._taskList());

  getTasks() {
    this._loading.set(true);

    const user = this.user();
    if (user) {
      return this._http
        .get<Task[]>(`${environment.task_base_url}/${user.id}`)
        .pipe(
          catchError((error) => {
            this._loading.set(false);
            console.error('Error al obtener las tareas', error);
            return of([]);
          })
        )
        .subscribe((tasks) => {
          this._taskList.set(tasks);
          this._loading.set(false);
        });
    }
    return console.error('No hay usuario logueado');
  }

  getTaskById(id: UUID) {
    return this._http
      .get<Task>(`${environment.task_base_url}/get-task/${id}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener la tarea', error);
          return throwError(error);
        })
      );
  }

  addTask(task: any) {
    const valid_task = {
      ...task,
      fecha_inicio: task.fecha_inicio
        ? this.formatDate(task.fecha_inicio)
        : null,
      fecha_fin: task.fecha_fin ? this.formatDate(task.fecha_fin) : null,
      user_id: this._authService.currentUser()?.id,
    };

    valid_task.user_id = this.user()!.id;
    return this._http.post<Task>(`${environment.task_base_url}`, valid_task);
  }
  formatDate(date: Date) {
    // Tansformar la fecha a un formato valido or el backend
    return date.toISOString().split('T')[0];
  }

  editTask(task: Task) {
    const task_edit = { ...task, user_id: this._authService.currentUser()?.id };
    console.log(task_edit);

    return this._http.put<Task>(`${environment.task_base_url}`, task_edit);
  }

  deleteTask(id: UUID) {
    return this._http.delete(`${environment.task_base_url}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la tarea', error);
        return of(false);
      })
    );
  }
}
