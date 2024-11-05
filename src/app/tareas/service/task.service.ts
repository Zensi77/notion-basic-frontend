import { computed, Injectable, signal } from '@angular/core';
import { Task, Prioridad, State } from '../interfaces/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksList = signal<Task[]>([
    {
      id: 1,
      title: 'Preparar presentación del proyecto',
      description: 'Crear la presentación para la reunión del próximo lunes.',
      state: State['no_comenzado'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-06'),
      fecha_fin: new Date('2023-11-10'),
    },
    {
      id: 2,
      title: 'Revisión de código',
      description:
        'Revisar el código de la última entrega para identificar mejoras.',
      state: State['no_comenzado'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-03'),
      fecha_fin: new Date('2023-11-07'),
    },
    {
      id: 3,
      title: 'Redactar informe mensual',
      description:
        'Escribir el informe de progreso mensual para enviarlo a gerencia.',
      state: State['no_comenzado'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-05'),
      fecha_fin: new Date('2023-11-08'),
    },
    {
      id: 4,
      title: 'Actualizar base de datos',
      description: 'Agregar nuevos registros y limpiar datos duplicados.',
      state: State['en_progreso'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-02'),
      fecha_fin: new Date('2023-11-09'),
    },
    {
      id: 5,
      title: 'Capacitación de seguridad',
      description:
        'Asistir a la sesión de capacitación obligatoria de seguridad.',
      state: State['completado'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-10-29'),
      fecha_fin: new Date('2023-11-01'),
    },
    {
      id: 6,
      title: 'Rediseño del logo',
      description: 'Colaborar con el equipo de diseño para rediseñar el logo.',
      state: State['no_comenzado'],
      prioridad: Prioridad['baja'],
      fecha_inicio: new Date('2023-11-10'),
      fecha_fin: new Date('2023-11-20'),
    },
    {
      id: 7,
      title: 'Probar funcionalidades nuevas',
      description:
        'Ejecutar pruebas para asegurar la calidad de las nuevas funciones.',
      state: State['en_progreso'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-04'),
      fecha_fin: new Date('2023-11-09'),
    },
    {
      id: 8,
      title: 'Actualizar página web',
      description:
        'Subir las últimas actualizaciones de contenido al sitio web.',
      state: State['no_comenzado'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-08'),
      fecha_fin: new Date('2023-11-12'),
    },
    {
      id: 9,
      title: 'Planificación trimestral',
      description: 'Crear el plan estratégico para el próximo trimestre.',
      state: State['no_comenzado'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-11'),
      fecha_fin: new Date('2023-11-15'),
    },
    {
      id: 10,
      title: 'Reunión con el equipo de marketing',
      description: 'Discutir las estrategias de marketing del próximo mes.',
      state: State['completado'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-01'),
      fecha_fin: new Date('2023-11-01'),
    },
    {
      id: 11,
      title: 'Revisión de inventario',
      description: 'Verificar las existencias de productos en almacén.',
      state: State['en_progreso'],
      prioridad: Prioridad['baja'],
      fecha_inicio: new Date('2023-11-04'),
      fecha_fin: new Date('2023-11-06'),
    },
    {
      id: 12,
      title: 'Documentación técnica',
      description:
        'Actualizar los documentos técnicos de los sistemas de la empresa.',
      state: State['no_comenzado'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-10'),
      fecha_fin: new Date('2023-11-18'),
    },
    {
      id: 13,
      title: 'Campaña de correo electrónico',
      description: 'Crear y enviar campaña de correo para clientes.',
      state: State['en_progreso'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-03'),
      fecha_fin: new Date('2023-11-05'),
    },
    {
      id: 14,
      title: 'Actualizar políticas de privacidad',
      description:
        'Revisar y actualizar las políticas de privacidad de la empresa.',
      state: State['no_comenzado'],
      prioridad: Prioridad['media'],
      fecha_inicio: new Date('2023-11-12'),
      fecha_fin: new Date('2023-11-20'),
    },
    {
      id: 15,
      title: 'Implementación de mejoras en software',
      description: 'Implementar las sugerencias de mejora del equipo.',
      state: State['no_comenzado'],
      prioridad: Prioridad['alta'],
      fecha_inicio: new Date('2023-11-10'),
      fecha_fin: new Date('2023-11-15'),
    },
  ]);

  public taskList = computed(() => this.tasksList());

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

    const tasks = this.tasksList();
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
