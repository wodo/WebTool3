import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, selectRouterFragment} from '../../app.state';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {InstructionSummary} from '../../model/instruction';
import {getInstructionSummaries} from '../../core/store/instruction-summary.selectors';
import {RequestInstructionSummaries} from '../../core/store/instruction-summary.actions';
import {filter, first, flatMap, map, publishReplay, refCount, takeUntil, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {NamesRequested} from '../../core/store/name.actions';
import {ValuesRequested} from '../../core/store/value.actions';
import {AuthService, User} from '../../core/service/auth.service';
import {
  CloneInstruction,
  CreateInstruction,
  DeactivateInstruction,
  DeleteInstruction, RequestInstruction
} from '../../core/store/instruction.actions';
import {FormControl, FormGroup} from '@angular/forms';
import {CalendarRequested} from '../../core/store/calendar.actions';
import {getInstructionById} from '../../core/store/instruction.selectors';

@Component({
  selector: 'avk-instruction-list',
  templateUrl: './instruction-list.component.html',
  styleUrls: ['./instruction-list.component.css']
})
export class InstructionListComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('dt') dt;

  private destroySubject = new Subject<void>();
  part$: Observable<string>;
  instructions$: Observable<InstructionSummary[]>;
  activeItem$: Observable<MenuItem>;
  display = false;
  finishedInstructions = [6, 7];
  activeInstructions = [1, 2, 3, 4, 5, 8, 9];
  allInstructions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  partNewInstruction = new BehaviorSubject<string>('');

  user$: Observable<User>;
  authState$: Observable<User>;
  userIsStaff$: Observable<boolean>;
  userIsAdmin$: Observable<boolean>;
  loginObject = {id: undefined, firstName: '', lastName: '', role: undefined, valState: 0};

  topicId = new FormControl('');
  startDate = new FormControl('');

  createInstruction: FormGroup = new FormGroup({
    topicId: this.topicId,
    startDate: this.startDate
  });

  menuItems: MenuItem[] = [
    {label: 'Alle Kurse', routerLink: ['/instructions']},
    {label: 'Kletterschule', url: '/instructions#indoor'},
    {label: 'Sommer Kurse', url: '/instructions#summer'},
    {label: 'Winter Kurse', url: '/instructions#winter'},
  ];

  constructor(private store: Store<AppState>, private router: Router, private userService: AuthService) {
    this.store.dispatch(new NamesRequested());
    this.store.dispatch(new ValuesRequested());
    this.store.dispatch(new CalendarRequested());
  }

  ngOnInit() {
    this.userIsStaff$ = this.userService.isStaff$;
    this.userIsAdmin$ = this.userService.isAdministrator$;

    /*this.authState$.pipe(
      tap(value => {
        this.loginObject = { ...value, valState: 0 };
        if (value.role === 'Administrator') {
          this.loginObject.valState = 4;
        } else if (value.role === 'Geschäftsstelle') {
          this.loginObject.valState = 3;
        } else if (value.role === 'Fachbereichssprecher') {
          this.loginObject.valState = 2;
        } else if (value.role === 'Trainer') {
          this.loginObject.valState = 1;
        } else { this.loginObject.valState = 0; }
      }),
    ).subscribe();*/

    this.part$ = this.store.pipe(
      takeUntil(this.destroySubject),
      select(selectRouterFragment),
      publishReplay(1),
      refCount()
    );

    this.activeItem$ = this.part$.pipe(
      takeUntil(this.destroySubject),
      map(part => {
        switch (part) {
          case 'indoor':
            return this.menuItems[1];
          case 'summer':
            return this.menuItems[2];
          case 'winter':
            return this.menuItems[3];
          default:
            return this.menuItems[0];
        }
      }),
      publishReplay(1),
      refCount()
    );

    this.instructions$ = this.part$.pipe(
      takeUntil(this.destroySubject),
      flatMap( part =>
        this.store.pipe(
          select(getInstructionSummaries),
          tap(instructions => {
            if (!instructions || !instructions.length) {
              this.store.dispatch(new RequestInstructionSummaries());
            }
          }),
          map(instructions =>
            instructions.filter(instruction =>
              (part === 'winter' && instruction.winter) ||
              (part === 'summer' && instruction.summer) ||
              (part === 'indoor' && instruction.indoor) ||
              !part
            )
          ),
          tap(() => this.partNewInstruction.next(part)),
        )
      ),
      publishReplay(1),
      refCount()
    );

    this.part$.subscribe();
    this.activeItem$.subscribe();
    this.instructions$.subscribe();

  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  ngAfterViewInit(): void {
    this.store.dispatch(new RequestInstructionSummaries());
    this.dt.filter(this.activeInstructions, 'stateId', 'in');
  }

  selectInstruction(instruction): void {
    if (!!instruction) {
      this.router.navigate(['instructions', instruction.id]);
    }
  }

  handleClick() {
    this.display = true;
  }

  create(topic, date) {
    this.store.dispatch(new CreateInstruction({topicId: topic, startDate: date}));
    this.display = false;
  }

  clone(instructionId) {
    this.store.pipe(
      select(getInstructionById(instructionId)),
      tap(instruction => {
        if (!instruction) {
          this.store.dispatch(new RequestInstruction({id: instructionId}));
        }
      }),
      filter(instruction => !!instruction),
      first(),
    ).subscribe(
      instruction => {
        this.store.dispatch(new CloneInstruction({instruction}));
      }
    );
  }

  delete(instructionId) {
    this.store.dispatch(new DeleteInstruction({id: instructionId}));
  }

  deactivate(instructionId) {
    this.store.dispatch(new DeactivateInstruction({id: instructionId}));
  }

  changeViewSet(event, dt) {
    if (!event.checked) {
      dt.filter(this.activeInstructions, 'stateId', 'in');
    } else {
      dt.filter(this.allInstructions, 'stateId', 'in');
    }
  }
}
