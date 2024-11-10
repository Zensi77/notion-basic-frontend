import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Prioridad, state, Task } from '../../interfaces/task.interface';
import { TaskService } from '../../service/task.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MaterialModule } from '../../../material/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { UUID } from 'crypto';

@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-task.component.html',
  styleUrl: './form-task.component.css',
})
export class FormTaskComponent implements OnInit {
  private _taskService = inject(TaskService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);
  private _snackBar = inject(MatSnackBar);

  id: UUID | null = null;
  prioridades: Prioridad[] = [Prioridad.baja, Prioridad.media, Prioridad.alta];
  states: state[] = [state.no_comenzado, state.en_progreso, state.completado];

  taskToEdit: Task | null = null;
  taskForm: FormGroup;

  constructor() {
    this.taskForm = this._fb.group({
      title: ['', Validators.required],
      description: [''],
      state: ['', Validators.required],
      prioridad: ['', Validators.required],
      fecha_inicio: new FormControl<Date | null>(null),
      fecha_fin: new FormControl<Date | null>(null),
    });
  }

  ngOnInit(): void {
    // Valida si hay un id en la ruta y lo guardo
    if (this._route.params.subscribe((params) => (this.id = params['id']))) {
      if (!this.id) return;

      this._taskService.getTaskById(this.id).subscribe({
        next: (task) => {
          // Lo realiza de forma asincrona
          this.taskToEdit = task;
          if (!this.taskToEdit) return;
          const {
            title,
            description,
            state,
            prioridad,
            fecha_inicio,
            fecha_fin,
          } = this.taskToEdit;
          this.taskForm.patchValue({
            title,
            description,
            state,
            prioridad,
            fecha_inicio,
            fecha_fin,
          });
        },
        error: (error) => {
          console.error('Error al obtener la tarea', error);
        },
      });
      console.log(this.taskToEdit);
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return this.taskForm.markAllAsTouched();
    }

    if (!this.id) {
      this._taskService.addTask(this.taskForm.value).subscribe({
        next: () => {
          this._snackBar.open('Tarea creada', 'Cerrar', {
            duration: 3000,
          });
          this._router.navigate(['/tareas']);
        },
        error: (error) => {
          console.error('Error al crear la tarea', error);
        },
      });
    } else {
      const taskToEdit = { id: this.taskToEdit?.id, ...this.taskForm.value };

      this._taskService.editTask(taskToEdit).subscribe({
        next: () => {
          this._snackBar.open('Tarea editada', 'Cerrar', {
            duration: 3000,
          });
          this._router.navigate(['/tareas']);
        },
        error: (error) => {
          console.error('Error al editar la tarea', error);
        },
      });
    }
  }
}
