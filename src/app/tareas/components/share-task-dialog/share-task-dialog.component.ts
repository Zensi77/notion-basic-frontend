import { Component, inject, OnInit, signal } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { Task } from '../../interfaces/task.interface';
import { TaskService } from '../../service/task.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-share-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: './share-task-dialog.component.html',
  styles: ``,
})
export class ShareTaskDialogComponent implements OnInit {
  private taskService = inject(TaskService);

  myControl = new FormControl<string | Task>('');
  filteredOptions!: Observable<Task[]>;

  // Accede a las tareas desde el servicio mediante `signal`
  listOfTasks = this.taskService.taskList();

  ngOnInit() {
    // Llama a getTasks y espera a que cargue
    this.taskService.getTasks();
    // Espera un poco para que se carguen las tareas en el servicio y luego inicializo el filtro
    setTimeout(() => {
      this.listOfTasks = this.taskService.taskList();
      this.initFilter();
    }, 200);
  }

  // Conforme escribo llamo a la función de filtro para actualizar la lista de tareas
  initFilter() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const filterValue =
          typeof value === 'string'
            ? value.toLowerCase()
            : value?.title.toLowerCase() || '';
        return this._filter(filterValue);
      })
    );
  }
  // Mostrar el título de la tarea en el input
  displayFn(task: Task): string {
    return task && task.title ? task.title : '';
  }

  // Lógica de filtro
  private _filter(value: string): Task[] {
    return this.listOfTasks.filter((task) =>
      task.title.toLowerCase().includes(value)
    );
  }

  close() {
    console.log('Cerrando modal...');
  }
}
