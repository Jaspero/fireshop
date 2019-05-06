import {Component} from '@angular/core';
import {CollectionReference} from '@angular/fire/firestore';
import {from, merge, Observable, of} from 'rxjs';
import {
  debounceTime,
  map,
  scan,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {Language} from 'shared/enums/language.enum';
import {RouteData} from '../../interfaces/route-data.interface';
import {ExportComponent} from '../export/export.component';
import {ListComponent} from '../list/list.component';

@Component({
  selector: 'jfsc-lang-list',
  template: ''
})
export class LangListComponent<
  T extends {id: any},
  R extends RouteData = RouteData
> extends ListComponent<T, R> {
  setItems() {
    let language: Language;

    const listeners = [];

    if (this.options.sort) {
      listeners.push(
        this.sort.sortChange.pipe(
          tap((sort: any) => {
            this.options.sort = sort;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    if (this.options.pageSize) {
      listeners.push(
        this.pageSize.valueChanges.pipe(
          tap(pageSize => {
            this.options.pageSize = pageSize;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    if (this.options.filters) {
      listeners.push(
        this.filters.valueChanges.pipe(
          debounceTime(400),
          tap(filters => {
            this.options.filters = filters;
            this.state.setRouteData(this.options);
          })
        )
      );
    }

    this.items$ = this.state.language$.pipe(
      switchMap(lang => {
        language = lang;

        return merge(...listeners).pipe(startWith(null));
      }),
      switchMap(() => {
        let items;

        this.dataLoading$.next(true);

        return this.loadItems(language, true).pipe(
          switchMap(its => {
            items = its;
            this.dataLoading$.next(true);
            return this.loadMore$.pipe(startWith(false));
          }),
          switchMap(toDo => {
            if (toDo) {
              return this.loadItems(language);
            } else {
              return of(items);
            }
          }),
          scan((acc, cur) => acc.concat(cur), []),
          tap(() => this.dataLoading$.next(false))
        );
      }),
      shareReplay(1)
    );
  }

  loadItems(lang: Language, reset = false) {
    if (reset) {
      this.cursor = null;
    }

    return this.afs
      .collection<T>(`${this.collection}-${lang}`, ref => {
        let final = ref;

        if (this.options.pageSize) {
          final = final.limit(this.options.pageSize) as CollectionReference;
        }

        if (this.options.sort) {
          final = final.orderBy(
            this.options.sort.active,
            this.options.sort.direction
          ) as CollectionReference;
        }

        final = this.runFilters(final);

        if (this.cursor) {
          final = final.startAfter(this.cursor) as CollectionReference;
        }

        return final;
      })
      .get()
      .pipe(
        map(actions => {
          if (actions.docs.length) {
            this.cursor = actions.docs[actions.docs.length - 1];

            this.hasMore$.next(true);

            return actions.docs.map(action => ({
              id: action.id,
              ...(action.data() as any)
            }));
          }

          this.hasMore$.next(false);

          return [];
        })
      );
  }

  delete(id: string): Observable<any> {
    return this.state.language$.pipe(
      switchMap(lang =>
        from(
          this.afs
            .collection(`${this.collection}-${lang}`)
            .doc(id)
            .delete()
        )
      )
    );
  }

  export() {
    this.state.language$
      .pipe(
        take(1),
        switchMap(lang =>
          this.bottomSheet
            .open(ExportComponent, {
              data: {
                collection: `${this.collection}-${lang}`,
                ids: this.selection.selected
              }
            })
            .afterOpened()
        )
      )
      .subscribe();
  }
}
