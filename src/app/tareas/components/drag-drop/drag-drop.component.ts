import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../service/task.service';
import { state, Task } from '../../interfaces/task.interface';
import { of } from 'rxjs';

@Component({
  selector: 'task-drag-drop',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  templateUrl: './drag-drop.component.html',
  styleUrl: './drag-drop.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragDropComponent implements OnInit {
  private _taskService = inject(TaskService);
  private _taskList = this._taskService.taskList;

  taskList = signal<Task[]>([]);
  ngOnInit(): void {
    this._taskService.getTasks();
  }

  // Getters por estado para que se actualicen en tiempo real
  get no_comenzado() {
    return this._taskList().filter((task) => task.state === state.no_comenzado);
  }

  get comenzado() {
    return this._taskList().filter((task) => task.state === state.en_progreso);
  }

  get completado() {
    return this._taskList().filter((task) => task.state === state.completado);
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(event.container.id);

      if (event.container.id === state.no_comenzado) {
        task.state = state.no_comenzado;
      } else if (event.container.id === state.en_progreso) {
        task.state = state.en_progreso;
      } else if (event.container.id === state.completado) {
        task.state = state.completado;
      }

      this._taskService.editTask(task).subscribe({
        next: () => {
          this.ngOnInit();
          this._taskService.getTasks();
        },
        error: (error) => {
          console.error('Error al cambiar estado', error);
          return of(null);
        },
      });
    }
  }
}
