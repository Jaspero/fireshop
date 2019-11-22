import {ModuleOverviewView} from './module-overview-view.interface';

export interface ModuleOverview {
  showViewSelector?: boolean;
  defaultView?: string;
  views?: ModuleOverviewView[];
}
