import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {StateService} from '../../services/state/state.service';
import {map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanReadModuleGuard implements CanActivate {
  constructor(
    private state: StateService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot
  ) {
    const {id} = route.params;

    return this.state.modules$.pipe(
      map(modules => {
        const module = modules.find(mod => mod.id === id);
        if (
          !module ||
          module.authorization &&
          module.authorization.read &&
          !module.authorization.read.includes(this.state.role)
        ) {
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      }),
      take(1),
    );
  }
}
