import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { TaskService } from '../../service/task.service';
import { Prioridad, state, Task } from '../../interfaces/task.interface';
import { MaterialModule } from '../../../material/material.module';
import { UUID } from 'node:crypto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { SharedTasksService } from '../../service/shared-tasks.service';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit {
  private _taskService = inject(TaskService);
  private _matDialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _sharedService = inject(SharedTasksService);

  tasks = this._taskService.taskList;

  ngOnInit(): void {
    this._taskService.getTasks();
  }

  getStatusClass(state: string) {
    switch (state) {
      case 'Completado':
        return 'completed';
      case 'En progreso':
        return 'pendiente';
      case 'No comenzado':
        return 'iniciar';
      default:
        return '';
    }
  }

  stateOrder = {
    [state.completado]: 3,
    [state.en_progreso]: 2,
    [state.no_comenzado]: 1,
  };

  priorityOrder = {
    [Prioridad.baja]: 3,
    [Prioridad.media]: 2,
    [Prioridad.alta]: 1,
  };

  sortBy(property: string) {
    const tasks = this.tasks();
    if (property === 'state') {
      tasks.sort((a, b) => this.stateOrder[a.state] - this.stateOrder[b.state]);
    } else if (property === 'prioridad') {
      tasks.sort(
        (a, b) =>
          this.priorityOrder[a.prioridad] - this.priorityOrder[b.prioridad]
      );
    } else {
      // Fecha
      tasks.sort((a, b) =>
        a[property as keyof Task] > b[property as keyof Task] ? 1 : -1
      );
    }
  }

  changeState(status: number, item: Task) {
    item.state =
      status == 0
        ? state.no_comenzado
        : status == 1
        ? state.en_progreso
        : state.completado;
    this._taskService.editTask(item).subscribe(() => {
      catchError((error) => {
        Swal.fire('Error', 'Error al modificar el estado de la tarea', 'error');
        return of(null);
      });
      this._taskService.getTasks();
      return this._snackBar.open('Estado de la tarea modificado', 'Cerrar', {
        duration: 2000,
      });
    });
  }

  deleteTask(id: UUID) {
    const dialog = this._matDialog.open(ConfirmDialogComponent, {
      data: { id },
    });

    dialog
      .afterClosed()
      .pipe(
        filter((result: boolean) => result), // Si el usuario cancela el dialogo, no se ejecuta el switchMap
        map(() => this._sharedService.deleteTask(id)),
        switchMap(() => {
          return this._sharedService
            .deleteTask(id)
            .pipe(switchMap(() => this._taskService.deleteTask(id)));
        }), // Si acepta el dialogo, se ejecuta el la accion
        catchError((error) => {
          Swal.fire('Error', 'Error al eliminar la tarea', 'error');
          return of([]);
        })
      )
      .subscribe(() => {
        this._taskService.getTasks();
        return this._snackBar.open('Tarea eliminada', 'Cerrar', {
          duration: 2000,
        });
      });
  }
}
