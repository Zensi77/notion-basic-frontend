export enum State {
  completado = 'Completado',
  en_progreso = 'En Progreso',
  no_comenzado = 'No Comenzado',
}

export enum Prioridad {
  baja = 'Baja',
  media = 'Media',
  alta = 'Alta',
}

export interface Task {
  id: number;
  title: string;
  description: string;
  state: State;
  prioridad: Prioridad;
  fecha_inicio: Date;
  fecha_fin: Date;
}
