import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {of} from 'rxjs';
import {InstanceOverviewContextService} from '../../../modules/module-instance/services/instance-overview-context.service';
import {StateService} from '../../services/state/state.service';

@Injectable({
  providedIn: 'root'
})
export class CustomModuleGuard implements CanActivate {
  constructor(
    private state: StateService,
    private ioc: InstanceOverviewContextService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const {
      params,
      queryParams,
      data
    } = route;
    const {module, ...other} = data;

    this.ioc.module$ = of(module({
      params,
      queryParams,
      data: other
    }));

    return true;
  }

}
