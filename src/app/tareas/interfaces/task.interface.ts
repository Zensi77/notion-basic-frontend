import { UUID } from 'crypto';

export enum state {
  completado = 'Completado',
  en_progreso = 'En progreso',
  no_comenzado = 'No comenzado',
}

export enum Prioridad {
  baja = 'Baja',
  media = 'Media',
  alta = 'Alta',
}

export interface Task {
  id: UUID;
  title: string;
  description: string;
  state: state;
  prioridad: Prioridad;
  fecha_inicio: Date;
  fecha_fin: Date;
  user_id: UUID;
}
