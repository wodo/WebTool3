import {Observable} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, selectRouterDetailId} from '../../app.state';
import {FormControl, FormGroup} from "@angular/forms";
import {NameListRequested} from "../../core/store/name.actions";
import {ValuesRequested} from "../../core/store/value.actions";
import {CalendarRequested} from "../../core/store/calendar.actions";
import {RequestInstruction} from "../../core/store/instruction.actions";
import {
  getInstructionIsLoading,
  selectInstructionById
} from "../../core/store/instruction.selectors";
import {Instruction} from "../../core/store/instruction.model";
import {map, tap} from "rxjs/operators";
import {State} from "../../core/store/state.reducer";
import {selectStatesState} from "../../core/store/value.selectors";
import {AuthService, User} from "../../core/service/auth.service";

interface Equipment {
  name: string;
  details: string[];
}

interface Requirements {
  name: string;
}

interface Tour {
  type;
  sdate;
  stime;
  edate;
  etime;
  shorttitle;
  longtitle;
  location;
}

interface Costs {
  pos;
  beschreibung;
  betrag;
}

@Component({
  selector: 'avk-instruction-detail',
  "styles": ["node_modules/primeflex/primeflex.css"],
  templateUrl: './instruction-detail.component.html',
  styleUrls: ['./instruction-detail.component.css']
})

export class InstructionDetailComponent implements OnInit, OnDestroy {

  instructionId$: Observable<number>;
  isLoading$: Observable<boolean>;
  formInstruction$: Observable<Instruction>;

  formState$: Observable<State>;
  authState$: Observable<User>;

  guide = new FormControl(undefined);
  team = new FormControl([]);
  costs = new FormControl('');
  revenue = new FormControl('');
  description = new FormControl('');
  notes = new FormControl('');
  bookingnr = new FormControl('');
  status = new FormControl('');
  concept = new FormControl('');
  shorttitle = new FormControl('');
  longtitle = new FormControl('');
  equipment = new FormControl( '');
  requirement = new FormControl('');
  numbermembermin = new FormControl('');
  numbermembermax = new FormControl('');
  distance = new FormControl('');
  service = new FormControl('');
  tourcosts = new FormControl('');
  costsctr = new FormControl('');
  costsname = new FormControl('');
  extracosts = new FormControl('');
  deposit = new FormControl('');
  memberfee = new FormControl('');
  startdate = new FormControl('');
  enddate = new FormControl('');
  datetype = new FormControl('');
  location = new FormControl('');
  multisingle = new FormControl('');

  instructionForm = new FormGroup({
    guide: this.guide,
    team: this.team,
    costs: this.costs,
    revenue: this.revenue,
    description: this.description,
    notes: this.notes,
    bookingnr: this.bookingnr,
    status: this.status,
    concept: this.concept,
    shorttitle: this.shorttitle,
    longtitle: this.longtitle,
    equipment: this.equipment,
    requirement: this.requirement,
    numbermembermin: this.numbermembermin,
    numbermembermax: this.numbermembermax,
    distance: this.distance,
    service: this.service,
    costsctr: this.costsctr,
    tourcosts: this.tourcosts,
    costsname: this.costsname,
    extracosts: this.extracosts,
    deposit: this.deposit,
    memberfee: this.memberfee,
    startdate: this.startdate,
    enddate: this.enddate,
    datetype: this.datetype,
    location: this.location,
    multisingle: this.multisingle
  });

  equipmentChoice: Equipment[];
  requirementChoice: Requirements[];
  tours: Tour[];
  totalcostsTable: Costs[];

  userIsValid: boolean = true;

  constructor(private store: Store<AppState>, private userService: AuthService) {
    this.store.dispatch(new NameListRequested());
    this.store.dispatch(new ValuesRequested());
    this.store.dispatch(new CalendarRequested());
    this.store.dispatch(new RequestInstruction({id: 2080}));
  }

  ngOnInit(): void {
    this.instructionId$ = this.store.pipe(select(selectRouterDetailId));
    this.isLoading$ = this.store.select(getInstructionIsLoading);

    this.authState$ = this.userService.user$;
    this.authState$.subscribe(value => console.log(value));

    // setTimeout(
    //   () => {this.store.select(selectInstructionById(2080))
    //     .subscribe((instruction: Instruction) => {console.log("instruction:",instruction);})
    //     .unsubscribe();
    //   }, 5000);

    this.formInstruction$ = this.store.select(selectInstructionById(2080));
    this.formState$ = this.store.select(selectStatesState);

    this.formState$.pipe(
      tap((state:State) => console.log("formState",state)),
      // map(instruction => instruction.guideId)
    ).subscribe();

    this.formInstruction$.pipe(
      tap((instruction:Instruction) => console.log("formInstruction",instruction)),
      // map(instruction => instruction.guideId)
    ).subscribe();

    this.formInstruction$.subscribe((instruction: Instruction) => {
      if (instruction !== undefined) {
        this.instructionForm.setValue({
          guide: instruction.guideId,
          team: instruction.teamIds,
          costs: '',
          revenue: '',
          description: instruction.advancesInfo,
          notes: '',
          bookingnr: 'Doof', //
          status: instruction.stateId,
          concept: instruction.topicId,
          shorttitle: '',
          longtitle: '',
          equipment: '',
          requirement: '',
          numbermembermin: instruction.minQuantity,
          numbermembermax: instruction.maxQuantity,
          distance: '',
          service: instruction.equipmentService,
          costsctr: 0,
          tourcosts: '',
          costsname: '',
          extracosts: '',
          deposit: '',
          memberfee: instruction.extraCharges,
          startdate: '',
          enddate: '',
          datetype: '',
          location: '',
          multisingle: ''
        });
      } else {
        this.instructionForm.setValue({
          guide: '',
          team: '',
          costs: '',
          revenue: '',
          description: '',
          notes: '',
          bookingnr: '',
          status: '',
          concept: '',
          shorttitle: '',
          longtitle: '',
          equipment: '',
          requirement: '',
          numbermembermin: '',
          numbermembermax: '',
          distance: '',
          service: '',
          costsctr: 0,
          tourcosts: '',
          costsname: '',
          extracosts: '',
          deposit: '',
          memberfee: '',
          startdate: '',
          enddate: '',
          datetype: '',
          location: '',
          multisingle: ''
        });
      }
    });

    /* Default Init-Sets */

    this.equipmentChoice = [
      {name: 'Bergtour', details:['Schuhe', 'Regenjacke', 'Brotzeit']},
      {name: 'Gletscher', details:['Schuhe', 'Regenjacke', 'Steigeisen']},
      {name: 'Klettern', details:['Schuhe', 'Seil', 'Helm']},
      {name: 'Mountainbiken', details:['Schuhe', 'Fahrrad', 'Helm']}
    ];

    this.requirementChoice = [
      {name:"Grundkurs Alpin"}, {name:"Grundkurs Klettern"}, {name:"Vorstiegsschein"}, {name:"Grundkurs Hochtouren"}
    ];

    this.tours = [];

    this.totalcostsTable = [];
  }

  ngOnDestroy(): void {}

  getTourCosts(): void {
    if (this.costsname.value !== '' && this.tourcosts.value !== '') {
      /* increasing counter for each cost instance */
      let ctr = this.costsctr.value;
      this.costsctr.setValue(++ctr);

      /* list input-data directly on website */
      let varCost: Costs = {pos: this.costsctr.value, betrag: this.tourcosts.value, beschreibung: this.costsname.value};
      this.totalcostsTable.push(varCost);
    }
  }

  getDateData(): void {
    if (this.datetype.value !== '' && this.startdate.value !== '' && this.enddate.value !== '' && this.location.value !== '') {
      let dateData: Tour = {type: this.datetype.value, sdate: this.startdate.value, stime:"",
        edate: this.enddate.value, etime:"", shorttitle:"", longtitle:"", location: this.location.value};

      this.tours.push(dateData);
    }
  }

}
