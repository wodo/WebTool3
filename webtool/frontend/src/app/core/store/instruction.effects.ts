import {Observable, Subject} from 'rxjs';
import {filter, map, publishReplay, refCount, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {InstructionService} from '../service/instruction.service';
import {
  AddInstruction,
  CloneInstruction, CreateInstruction, DeactivateInstruction, DeleteInstruction,
  InstructionActionTypes, InstructionCreateComplete, InstructionDeactivateComplete, InstructionDeleteComplete,
  InstructionNotModified, InstructionUpdateComplete,
  RequestInstruction, UpsertInstruction
} from './instruction.actions';
import {Event} from '../../model/event';
import {AppState} from '../../app.state';
import {AddEvent} from './event.actions';
import {Instruction} from './instruction.model';
import {Instruction as RawInstruction} from '../../model/instruction';
import {getEventById, getEventsByIds} from './event.selectors';

function convertDecimal(rawValue: string): number {
  return Number(rawValue.replace('.', ''));
}

@Injectable({
  providedIn: 'root'
})
export class InstructionEffects {
  events$: Observable<Event[]>;
  private destroySubject = new Subject<void>();

  constructor(private actions$: Actions, private instructionService: InstructionService, private store: Store<AppState>) {}

  @Effect()
  loadInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<RequestInstruction>(InstructionActionTypes.RequestInstruction),
    map((action: RequestInstruction) => action.payload),
    switchMap(payload => {
      return this.instructionService.getInstruction(payload.id).pipe(
        map(instruction => {
          if (instruction.id !== 0) {
            return new AddInstruction({instruction: this.transformInstruction(instruction)});
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  @Effect()
  cloneInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<CloneInstruction>(InstructionActionTypes.CloneInstruction),
    map((action: CloneInstruction) => action.payload),
    switchMap(payload => {
      return this.instructionService.cloneInstruction(payload.id).pipe(
        map(instruction => {
          if (instruction.id !== 0) {
            return new AddInstruction({instruction: this.transformInstruction(instruction)});
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  @Effect()
  deleteInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteInstruction>(InstructionActionTypes.DeleteInstruction),
    map((action: DeleteInstruction) => action.payload),
    switchMap((payload) => {
      return this.instructionService.deleteInstruction(payload.id).pipe(
        map(instruction => {
          if (instruction === null) {
            return new InstructionDeleteComplete();
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  @Effect()
  deactivateInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<DeactivateInstruction>(InstructionActionTypes.DeactivateInstruction),
    map((action: DeactivateInstruction) => action.payload),
    switchMap(payload => {
      return this.instructionService.deactivateInstruction(payload.id).pipe(
        map(instruction => {
          if (instruction.id !== 0) {
            return new InstructionDeactivateComplete();
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  @Effect()
  createInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<CreateInstruction>(InstructionActionTypes.CreateInstruction),
    map((action: CreateInstruction) => action.payload),
    switchMap(payload => {
      return this.instructionService.createInstruction(payload.topicId, payload.startDate).pipe(
        map(instruction => {
          if (instruction.topicId !== 0) {
            return new InstructionCreateComplete();
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  @Effect()
  safeInstruction$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertInstruction>(InstructionActionTypes.UpsertInstruction),
    map((action: UpsertInstruction) => action.payload),
    switchMap(payload  => {
      console.log(payload);
      return this.instructionService.upsertInstruction(this.tranformInstructionForSaving(payload.instruction)).pipe(
        map(instruction => {
          if (instruction !== null) {
            return new InstructionUpdateComplete();
          } else {
            return new InstructionNotModified();
          }
        })
      );
    })
  );

  transformInstruction(instruction: RawInstruction): Instruction {
    const instructionId = instruction.id;
    let meetingIds: number[];

    this.store.dispatch(new AddEvent({event: instruction.instruction}));
    meetingIds = instruction.meetings.map((event: Event): number => {
      this.store.dispatch(new AddEvent({event}));
      return event.id;
    });

    delete instruction.instruction;
    delete instruction.meetings;

    return {
      ... instruction,
      instructionId,
      meetingIds,
      admission: convertDecimal(instruction.admission),
      advances: convertDecimal(instruction.advances),
      extraCharges: convertDecimal(instruction.extraCharges)
    };
  }

  tranformInstructionForSaving(instructionInterface: Instruction): RawInstruction {
    let instruction: any = {};
    const meetings: any[] = [];
    this.events$ = this.store.select(getEventsByIds([instructionInterface.instructionId, ... instructionInterface.meetingIds])).pipe(
      takeUntil(this.destroySubject),
      tap(events => {
        instruction = events[0];
        events.shift();
        events.forEach(event => meetings.push(event));
      })
    );
    this.events$.subscribe();

    delete instructionInterface.instructionId;
    delete instructionInterface.meetingIds;

    this.destroySubject.complete();

    return {
      ... instructionInterface,
      instruction,
      meetings,
      admission: String(instructionInterface.admission * 100),
      advances: String(instructionInterface.advances * 100),
      extraCharges: String(instructionInterface.extraCharges * 100)
    };
  }
}
