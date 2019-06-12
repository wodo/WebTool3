import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, selectRouterDetailId} from '../../app.state';
import {NameListRequested} from "../../core/store/name.actions";
import {ValuesRequested} from "../../core/store/value.actions";
import {CalendarRequested} from "../../core/store/calendar.actions";
import {RequestInstruction} from "../../core/store/instruction.actions";
import {getInstructionById} from "../../core/store/instruction.selectors";
import {Instruction} from "../../core/store/instruction.model";
import {State} from "../../core/store/state.reducer";
import {selectStatesState} from "../../core/store/value.selectors";
import {AuthService, User} from "../../core/service/auth.service";
import {getEventById, getEventsByIds} from "../../core/store/event.selectors";
import {filter, flatMap, map, publishReplay, refCount, takeUntil, tap} from 'rxjs/operators';
import {getTopicById} from '../../core/store/value.selectors';
import {Event} from '../../model/event';
import {Topic} from '../../model/value';
import {FormArray, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'avk-instruction-detail',
  templateUrl: './instruction-detail.component.html',
  styleUrls: ['./instruction-detail.component.css']
})

export class InstructionDetailComponent implements OnInit, OnDestroy {

  private destroySubject = new Subject<void>();
  private instructionSubject = new BehaviorSubject<FormGroup>(undefined);
  private topicSubject = new BehaviorSubject<FormGroup>(undefined);
  private eventsSubject = new BehaviorSubject<FormArray>(undefined);

  instructionGroup$: Observable<FormGroup> = this.instructionSubject.asObservable();
  topicGroup$: Observable<FormGroup> = this.topicSubject.asObservable();
  eventArray$: Observable<FormArray> = this.eventsSubject.asObservable();

  instructionId$: Observable<number>;
  instruction$: Observable<Instruction>;
  topic$: Observable<Topic>;
  eventIds$: Observable<number[]>;
  events$: Observable<Event[]>;
  event$: Observable<Event>;


  constructor(private store: Store<AppState>, private userService: AuthService) {
    this.store.dispatch(new NameListRequested());
    this.store.dispatch(new CalendarRequested());
  }

  ngOnInit(): void {

    this.instructionId$ = this.store.select(selectRouterDetailId);

    this.instruction$ = this.instructionId$.pipe(
      takeUntil(this.destroySubject),
      flatMap(id => this.store.pipe(
        select(getInstructionById(id)),
        tap(instruction => {
          if (!instruction) {
            this.store.dispatch(new RequestInstruction({id}));
          } else {
            this.instructionSubject.next(instructionGroupFactory(instruction));
          }
        })
      )),
      publishReplay(1),
      refCount()
    );

    this.topic$ = this.instruction$.pipe(
      takeUntil(this.destroySubject),
      filter(instruction => !!instruction),
      flatMap( instruction => this.store.pipe(
        select(getTopicById(instruction.topicId)),
        tap(topic => {
          if (!topic) {
            this.store.dispatch((new ValuesRequested()));
          } else {
            this.topicSubject.next(topicGroupFactory(topic));
          }
        })
      ))
    );

    this.eventIds$ = this.instruction$.pipe(
      takeUntil(this.destroySubject),
      filter(instruction => !!instruction),
      map(instruction => [instruction.instructionId, ...instruction.meetingIds])
    );

    this.events$ = this.eventIds$.pipe(
      takeUntil(this.destroySubject),
      filter(eventIds => !!eventIds),
      flatMap(eventIds => this.store.select(getEventsByIds(eventIds)).pipe(
        filter(() => !!eventIds && eventIds.length > 0),
        tap(events => {
          const eventArray = new FormArray([]);
          events.forEach((event: Event) => {
            eventArray.push(eventGroupFactory(event));
          });
          this.eventsSubject.next(eventArray);
        })
      )),
    );

    this.instructionId$.subscribe();
    this.instruction$.subscribe();
    this.topic$.subscribe();
    this.eventIds$.subscribe();
    this.events$.subscribe();
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.instructionSubject.complete();
    this.topicSubject.complete();
    this.eventsSubject.complete();
  }
}

function instructionGroupFactory(instruction: Instruction): FormGroup {
  return new FormGroup({
    id: new FormControl(instruction.id),
    reference: new FormControl(instruction.reference),
    guideId: new FormControl(instruction.guideId),
    teamIds: new FormControl(instruction.teamIds),
    topicId: new FormControl(instruction.topicId),
    instructionId: new FormControl(instruction.instructionId),
    meetingIds: new FormControl(instruction.meetingIds),
    lowEmissionAdventure: new FormControl(instruction.lowEmissionAdventure),
    ladiesOnly: new FormControl(instruction.ladiesOnly),
    isSpecial: new FormControl(instruction.isSpecial),
    categoryId: new FormControl(instruction.categoryId),
    qualificationIds: new FormControl(instruction.qualificationIds),
    preconditions: new FormControl(instruction.preconditions),
    equipmentIds: new FormControl(instruction.equipmentIds),
    miscEquipment: new FormControl(instruction.miscEquipment),
    equipmentService: new FormControl(instruction.equipmentService),
    admission: new FormControl(instruction.admission),
    advances: new FormControl(instruction.advances),
    advancesInfo: new FormControl(instruction.advancesInfo),
    extraCharges: new FormControl(instruction.extraCharges),
    extraChargesInfo: new FormControl(instruction.extraChargesInfo),
    minQuantity: new FormControl(instruction.minQuantity),
    maxQuantity: new FormControl(instruction.maxQuantity),
    curQuantity: new FormControl(instruction.curQuantity),
    stateId: new FormControl(instruction.stateId)
  });
}

function topicGroupFactory(topic: Topic): FormGroup {
  return new FormGroup({
    id: new FormControl(topic.id),
    code: new FormControl(topic.code),
    title: new FormControl(topic.title),
    name: new FormControl(topic.name),
    description: new FormControl(topic.description),
    preconditions: new FormControl(topic.preconditions),
    qualificationIds: new FormControl(topic.qualificationIds),
    equipmentIds: new FormControl(topic.equipmentIds),
    miscEquipment: new FormControl(topic.miscEquipment)
  });
}

function eventGroupFactory(event: Event): FormGroup {
    return new FormGroup({
      id: new FormControl(event.id),
      title: new FormControl(event.title),
      name: new FormControl(event.name),
      description: new FormControl(event.description),
      startDate: new FormControl(event.startDate),
      startTime: new FormControl(event.startTime),
      approximateId: new FormControl(event.approximateId),
      endDate: new FormControl(event.endDate),
      rendezvous: new FormControl(event.rendezvous),
      location: new FormControl(event.location),
      reservationService: new FormControl(event.reservationService),
      source: new FormControl(event.source),
      link: new FormControl(event.link),
      map: new FormControl(event.map),
      distal: new FormControl(event.distal),
      distance: new FormControl(event.distance),
      publicTransport: new FormControl(event.publicTransport),
      shuttleService: new FormControl(event.shuttleService)
    });
  }
