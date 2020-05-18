import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, map, startWith, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'jfsc-af-autocomplete',
  templateUrl: './af-autocomplete.component.html',
  styleUrls: ['./af-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AfAutocompleteComponent implements OnInit {
  constructor() {}

  @Input()
  placeholder: string;

  @Input()
  query: (search: string) => AngularFirestoreCollection;

  @Input()
  displayKey = 'id';

  @ContentChild('afOption', {static: true})
  optionTemplate: TemplateRef<any>;

  @Output()
  optionSelected = new EventEmitter();

  search = new FormControl('');
  results$: Observable<any[]>;
  loading$ = new BehaviorSubject(false);

  ngOnInit() {
    this.results$ = this.search.valueChanges.pipe(
      debounceTime(300),
      tap(() => this.loading$.next(true)),
      startWith(''),
      switchMap(value => this.query(value).get()),
      map(res =>
        res.docs.map(it => ({
          id: it.id,
          ...it.data()
        }))
      ),
      tap(() => this.loading$.next(false))
    );
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.optionSelected.next(event.option.value);
    this.search.setValue('');
  }
}
