import { computed, inject, Injectable, signal } from '@angular/core';
import { Task, Prioridad, State } from '../interfaces/task.interface';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _authService = inject(AuthService);
  private _tasksList = signal<Task[]>([]);

  user = computed(() => this._authService.currentUser());
  tasks = computed(() => this._tasksList());

  constructor(private _http: HttpClient) {
    this.getTasks();
  }

  getTasks() {
    const user = this.user();
    if (user) {
      this._http
        .get<Task[]>(`${environment.task_base_url}/${user.id}`)
        .subscribe((tasks) => this._tasksList.set(tasks));
    }
  }

  getTaskById(id: number) {
    return this._tasksList().filter((task) => task.id === id)[0];
  }

  addTask(task: Task) {}
  editTask(task: Task) {}

  sortBy(property: string) {
    const stateOrder = {
      [State.completado]: 3,
      [State.en_progreso]: 2,
      [State.no_comenzado]: 1,
    };

    const priorityOrder = {
      [Prioridad.baja]: 3,
      [Prioridad.media]: 2,
      [Prioridad.alta]: 1,
    };

    const tasks = this._tasksList();
    if (property === 'state') {
      tasks.sort((a, b) => stateOrder[a.state] - stateOrder[b.state]);
    } else if (property === 'prioridad') {
      tasks.sort(
        (a, b) => priorityOrder[a.prioridad] - priorityOrder[b.prioridad]
      );
    } else {
      tasks.sort((a, b) =>
        a[property as keyof Task] > b[property as keyof Task] ? 1 : -1
      );
    }
  }
}
