import {Observable, Subject} from 'rxjs';
import {map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {Action, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Injectable} from '@angular/core';
import {TourService} from '../service/tour.service';
import {
  AddTour,
  CloneTour,
  TourActionTypes,
  TourNotModified,
  RequestTour,
  DeleteTour,
  DeactivateTour,
  UpsertTour, CreateTour, UpdateTour
} from './tour.actions';
import {AppState} from '../../app.state';
import {AddEvent} from './event.actions';
import {Tour} from './tour.model';
import {Tour as RawTour} from '../../model/tour';
import {getEventsByIds} from './event.selectors';
import {Event} from '../../model/event';
import {RequestTourSummaries} from './tour-summary.actions';
import {Router} from '@angular/router';

function convertDecimal(rawValue: string): number {
  return Number(rawValue);
}

@Injectable({
  providedIn: 'root'
})
export class TourEffects {
  events$: Observable<Event[]>;
  private destroySubject = new Subject<void>();

  constructor(private actions$: Actions, private tourService: TourService, private store: Store<AppState>, private router: Router) {}

  @Effect()
  loadTour$: Observable<Action> = this.actions$.pipe(
    ofType<RequestTour>(TourActionTypes.RequestTour),
    map((action: RequestTour) => action.payload),
    switchMap(payload => {
      return this.tourService.getTour(payload.id).pipe(
        map(tour => {
          if (tour.id !== 0) {
            return new AddTour({tour: this.transformTour(tour)});
          } else {
            return new TourNotModified();
          }
        })
      );
    })
  );

  @Effect()
  cloneTour$: Observable<Action> = this.actions$.pipe(
    ofType<CloneTour>(TourActionTypes.CloneTour),
    map((action: CloneTour) => action.payload),
    switchMap(payload => {
      return this.tourService.cloneTour(this.tranformTourForCloning(payload.tour)).pipe(
        map(tour => {
          if (tour.id !== 0) {
            this.router.navigate(['tours', tour.id]);
            return new RequestTourSummaries();
          } else {
            return new TourNotModified();
          }
        })
      );
    })
  );

  @Effect()
  deleteTour$: Observable<Action> = this.actions$.pipe(
    ofType<DeleteTour>(TourActionTypes.DeleteTour),
    map((action: DeleteTour) => action.payload),
    switchMap((payload) => {
      return this.tourService.deleteTour(payload.id).pipe(
        map(tour => {
          if (tour === null) {
            return new RequestTourSummaries();
          } else {
            return new TourNotModified();
          }
        })
      );
    })
  );

  @Effect()
  deactivateTour$: Observable<Action> = this.actions$.pipe(
    ofType<DeactivateTour>(TourActionTypes.DeactivateTour),
    map((action: DeactivateTour) => action.payload),
    switchMap(payload => {
      return this.tourService.deactivateTour(payload.id).pipe(
        map(tour => {
          if (tour.id !== 0) {
            return new RequestTourSummaries();
          } else {
            return new TourNotModified();
          }
        })
      );
    })
  );

  @Effect()
  createTour$: Observable<Action> = this.actions$.pipe(
    ofType<CreateTour>(TourActionTypes.CreateTour),
    map((action: CreateTour) => action.payload),
    switchMap(payload => {
      return this.tourService.createTour(
        payload.categoryId, payload.startDate, payload.deadline, payload.preliminary, payload.guideId
      ).pipe(
        map(tour => {
          if (tour.id !== 0) {
            this.router.navigate(['tours', tour.id]);
            return new RequestTourSummaries();
          } else {
            return new TourNotModified();
          }
        })
      );
    })
  );

  @Effect()
  safeTour$: Observable<Action> = this.actions$.pipe(
    ofType<UpsertTour>(TourActionTypes.UpsertTour),
    map((action: UpsertTour) => action.payload),
    switchMap(payload  => {
      return this.tourService.upsertTour(this.tranformTourForSaving(payload.tour)).pipe(
        map(tour => {
          if (tour.id !== 0) {
            alert('Tour erfolgreich gespeichert.');
            const tourInterface = this.transformTour(tour);
            this.store.dispatch(new RequestTourSummaries());
            return new UpdateTour({tour: {
              id: tourInterface.id,
              changes: {...tourInterface}
            }});
          } else {
            alert('Tour speichern gescheitert, nocheinmal versuchen oder Seite neuladen.');
            return new TourNotModified();
          }
        })
      );
    })
  );

  transformTour(tour: RawTour): Tour {
    const tourId = tour.id;
    const deadlineId = tour.deadline.id;
    let preliminaryId = null;

    this.store.dispatch(new AddEvent({event: tour.tour}));
    this.store.dispatch(new AddEvent({event: tour.deadline}));

    if (tour.preliminary !== null) {
      preliminaryId = tour.preliminary.id;
      this.store.dispatch(new AddEvent({event: tour.preliminary}));
    }

    delete tour.tour;
    delete tour.deadline;
    delete tour.preliminary;

    return {
      ... tour,
      tourId,
      deadlineId,
      preliminaryId,
      admission: convertDecimal(tour.admission),
      advances: convertDecimal(tour.advances),
      extraCharges: convertDecimal(tour.extraCharges)
    };
  }

  tranformTourForSaving(tourInterface: Tour): RawTour {
    let tour: any = {};
    let deadline: any = {};
    let preliminary: any = null;

    this.events$ = this.store.select(getEventsByIds([tourInterface.tourId, tourInterface.deadlineId, tourInterface.preliminaryId])).pipe(
      takeUntil(this.destroySubject),
      tap(events => {
        tour = events[0];
        deadline = events[1];
        if (events.length > 2) {
          preliminary = events[2];
        }
      })
    );
    this.events$.subscribe();

    delete tourInterface.tourId;
    delete tourInterface.deadlineId;
    delete tourInterface.preliminaryId;

    this.destroySubject.complete();

    /* Check contradictory distance/distal fields before saving */
    if (!tour.distal) { tour.distance = 0; }
    if (!deadline.distal) { deadline.distance = 0; }
    if (preliminary) { if (!preliminary.distance) { preliminary.distance = 0; }}

    return {
      ... tourInterface,
      tour,
      deadline,
      preliminary,
      admission: String(tourInterface.admission),
      advances: String(tourInterface.advances),
      extraCharges: String(tourInterface.extraCharges)
    };
  }

  tranformTourForCloning(tourInterface: Tour): RawTour {
    let tour: any = {};
    let deadline: any = {};
    let preliminary: any = null;

    this.events$ = this.store.select(getEventsByIds([tourInterface.tourId, tourInterface.deadlineId, tourInterface.preliminaryId])).pipe(
      takeUntil(this.destroySubject),
      tap(events => {
        tour = events[0];
        deadline = events[1];
        if (events.length > 2) {
          preliminary = events[2];
        }
      })
    );
    this.events$.subscribe();

    delete tourInterface.tourId;
    delete tourInterface.deadlineId;
    delete tourInterface.preliminaryId;

    this.destroySubject.complete();

    return {
      ... tourInterface,
      tour,
      deadline,
      preliminary,
      admission: String(tourInterface.admission),
      advances: String(tourInterface.advances),
      extraCharges: String(tourInterface.extraCharges)
    };
  }
}
