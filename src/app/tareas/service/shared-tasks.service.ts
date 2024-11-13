import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/services/auth.service';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { SharedTask } from '../interfaces/sharedTask.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedTasksService {
  private _http = inject(HttpClient);
  private authService = inject(AuthService);

  url = environment.shared_base_url;
  getList(): Observable<Task[]> {
    const url = `${this.url}`;
    const userId = this.authService.currentUser()?.id;
    return this._http.get<Task[]>(`${url}/${userId}`);
  }

  shareTask(data: SharedTask): Observable<boolean> {
    const url = `${this.url}/${this.authService.currentUser()?.id}`;

    return this._http.post<boolean>(url, data);
  }
}
