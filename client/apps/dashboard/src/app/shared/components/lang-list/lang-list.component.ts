import {Component} from '@angular/core';
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

    this.items$ = this.state.language$.pipe(
      switchMap(lang => {
        language = lang;

        return merge(
          this.sort.sortChange.pipe(
            tap((sort: any) => {
              this.options.sort = sort;
              this.state.setRouteData(this.options);
            })
          ),

          this.pageSize.valueChanges.pipe(
            tap(pageSize => {
              this.options.pageSize = pageSize;
              this.state.setRouteData(this.options);
            })
          ),

          this.filters.valueChanges.pipe(
            debounceTime(400),
            tap(filters => {
              this.options.filters = filters;
              this.state.setRouteData(this.options);
            })
          )
        ).pipe(startWith(null));
      }),
      switchMap(() => {
        let items;

        this.dataLoading$.next(true);

        return this.loadItems(language, this.realTime, true).pipe(
          switchMap(its => {
            items = its;
            this.dataLoading$.next(true);
            return this.loadMore$.pipe(startWith(false));
          }),
          switchMap(toDo => {
            if (toDo) {
              return this.loadItems(language, false);
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

  loadItems(lang: Language, continues: boolean, reset = false) {
    if (reset) {
      this.cursor = null;
    }

    const changes = this.afs
      .collection<T>(`${this.collection}-${lang}`, ref => {
        let final = ref
          .limit(this.options.pageSize)
          .orderBy(this.options.sort.active, this.options.sort.direction);

        final = this.runFilters(final);

        if (this.cursor) {
          final = final.startAfter(this.cursor);
        }

        return final;
      })
      .snapshotChanges()
      .pipe(
        map(actions => {
          if (actions.length) {
            this.cursor = actions[actions.length - 1].payload.doc;

            this.hasMore$.next(true);

            return actions.map(action => ({
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as any)
            }));
          }

          this.hasMore$.next(false);

          return [];
        })
      );

    /**
     * If data shouldn't be streamed continually
     * we only take one emit from the stream
     */
    if (!continues) {
      changes.pipe(take(1));
    }

    return changes;
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
}
