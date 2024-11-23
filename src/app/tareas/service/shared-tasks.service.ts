import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment.development';
import { AuthService } from '../../auth/services/auth.service';
import { Task } from '../interfaces/task.interface';
import { listShared, SharedTask } from '../interfaces/sharedTask.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedTasksService {
  private _http = inject(HttpClient);
  private authService = inject(AuthService);

  url = environment.shared_base_url;
  getList(): Observable<listShared[]> {
    const userId = this.authService.currentUser()?.id;
    return this._http.get<listShared[]>(`${this.url}/${userId}`);
  }

  shareTask(data: SharedTask): Observable<boolean> {
    const url = `${this.url}/${this.authService.currentUser()?.id}`;

    return this._http.post<boolean>(url, data);
  }
}
