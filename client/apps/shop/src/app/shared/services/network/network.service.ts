import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

/**
 * Keeps track of online/offline state
 */
@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  isOnline$ = new BehaviorSubject<boolean>(true);

  init() {
    window.addEventListener('online', () => {
      this.isOnline$.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline$.next(false);
    });
  }
}
