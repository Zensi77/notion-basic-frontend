enum State {
  'No comenzado',
  'Empezado',
  'Completado',
}

enum Prioridad {
  'Baja',
  'Media',
  'Alta',
}

export interface Tarea {
  id: number;
  title: string;
  description: string;
  state: State;
  prioridad: Prioridad;
  fecha_inicio: Date;
  fecha_fin: Date;
}
