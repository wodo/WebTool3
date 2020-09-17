import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  forwardRef, Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, FormControlName, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Dropdown} from 'primeng/dropdown';
import {BehaviorSubject, Observable, ReplaySubject, Subject, Subscription} from 'rxjs';
import {Fitness as RawFitness} from '../../model/value';
import {State as FitnessState} from '../store/fitness.reducer';
import {stateValidator} from '../dropdown/dropdown.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../app.state';
import {getFitnessState} from '../store/value.selectors';
import {delay, publishReplay, refCount, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'avk-fitnessselect',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FitnessselectComponent),
      multi: true
    }
  ],
  templateUrl: './fitnessselect.component.html',
  styleUrls: ['./fitnessselect.component.css']
})
export class FitnessselectComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit, ControlValueAccessor {

  @ViewChild(Dropdown) dropdown: Dropdown;
  @ContentChild(FormControlName) formControlNameRef: FormControlName;
  formControl: FormControl;
  delegatedMethodCalls = new ReplaySubject<(_: ControlValueAccessor) => void>();
  delegatedMethodsSubscription: Subscription;
  private destroySubject = new Subject<void>();
  fitnessSubject = new BehaviorSubject<RawFitness[]>(undefined);

  originalControl = new FormControl(null);
  choiceControl = new FormControl('');

  formState$: Observable<FitnessState>;
  formStateComponent$: Observable<FitnessState>;

  readonly = false;
  editable = false;

  categorySelect = 0;

  @Input()
  set readOnly(value: boolean) {
    this.readonly = value;
  }

  @Input()
  set editAble(value: boolean) {
    this.editable = value;
  }

  @Input()
  set categorySet(value: number) {
    this.categorySelect = value;
  }

  group = new FormGroup(
    {
      original: this.originalControl,
      choice: this.choiceControl,
    },
    [stateValidator]
  );

  status: RawFitness[] = new Array(1).fill({id: 0, level: null, categoryId: null, code: 'Fitnesss',
    description: 'Fitness auswählen'});


  OnChangeWrapper(onChange: (stateIn) => void): (stateOut: RawFitness) => void {
    return ((state: RawFitness): void => {
      this.formControl.setValue(state);
      this.choiceControl.setValue(state);
      onChange(state.level);
    });
  }

  registerOnChange(fn: any): void {
    this.delegatedMethodCalls.next(accessor => accessor.registerOnChange(this.OnChangeWrapper(fn)));
  }

  registerOnTouched(fn: any): void {
    this.delegatedMethodCalls.next(accessor => accessor.registerOnTouched(fn));
  }

  setDisabledState(isDisabled: boolean): void {
    this.delegatedMethodCalls.next(accessor => accessor.setDisabledState(isDisabled));
  }

  writeValue(stateId): void {
    if (typeof stateId === 'number') {
      for (const el in this.status) {
        if (stateId === this.status[el].level) {
          stateId = this.status[el];
        }
      }
    }
    this.delegatedMethodCalls.next(accessor => accessor.writeValue(stateId));
  }

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.formState$ = this.store.select(getFitnessState);

    this.formStateComponent$ = this.formState$.pipe(
      takeUntil(this.destroySubject),
      tap( state => {
        Object.keys(state.entities).forEach( key => {
          if (state.entities[key].categoryId === this.categorySelect) {
            this.status.push(state.entities[key]);
          }
        });
      }),
      // shareReplay(),
      publishReplay(1),
      refCount()
    );
    this.formStateComponent$.subscribe();

    this.fitnessSubject.next(this.status);
  }

  ngAfterViewInit(): void {
    this.delegatedMethodsSubscription = this.delegatedMethodCalls.pipe(
      delay(0),
    ).subscribe(fn => fn(this.dropdown));
  }

  ngOnDestroy(): void {
    if (this.delegatedMethodsSubscription) {
      this.delegatedMethodsSubscription.unsubscribe();
    }
    this.destroySubject.next();
    this.destroySubject.complete();
    this.fitnessSubject.complete();
  }

  ngAfterContentInit(): void {
    this.formControl = this.formControlNameRef.control;
    this.originalControl.setValue(this.formControl);
    this.choiceControl.setValue(this.formControl.value);
  }
}
