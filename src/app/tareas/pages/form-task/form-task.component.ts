import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from 'express';
import { Prioridad, State, Task } from '../../interfaces/task.interface';
import { state } from '@angular/animations';
import { TaskService } from '../../service/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [],
  templateUrl: './form-task.component.html',
  styleUrl: './form-task.component.css',
})
export class FormTaskComponent implements OnInit {
  private _taskService = inject(TaskService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _fb = inject(FormBuilder);

  id = 0;
  taskToEdit: Task | null = null;
  taskForm: FormGroup;

  private _edit = false;

  constructor() {
    this.taskForm = this._fb.group({
      title: ['', Validators.required],
      description: [''],
      state: [State.no_comenzado],
      Prioridad: [Prioridad.baja],
      fecha_inicio: [''],
      fecha_fin: [''],
    });
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => (this.id = params['id']));

    if (this.id) {
      this.taskToEdit = this._taskService.getTaskById(this.id);
      const { title, description, state, prioridad, fecha_inicio, fecha_fin } =
        this.taskToEdit;
      this.taskForm.setValue({
        title,
        description,
        state,
        prioridad,
        fecha_inicio,
        fecha_fin,
      });
    }
  }

  onSubmit() {
    if (this.taskForm.invalid) {
      return this.taskForm.markAllAsTouched();
    }

    this._edit
      ? this._taskService.editTask(this.taskForm.value)
      : this._taskService.addTask(this.taskForm.value);
  }
}
