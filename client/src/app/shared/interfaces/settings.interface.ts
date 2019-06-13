import {Role} from '../enums/role.enum';

export interface Settings {
  roles: Array<{email: string; role: Role}>;
}
