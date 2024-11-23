import { User } from '../../auth/interfaces/user.interfaces';
import { Task } from './task.interface';

export interface SharedTask {
  task_id: string;
  email: string;
}

export interface listShared {
  task: Task;
  creator: User;
}
