import {createFeatureSelector, createSelector} from '@ngrx/store';
import {ValueState} from './value.reducer';
import {TourCalculation, Values} from './value.model';
import {OpeningHours, State as RawState} from '../../model/value';
import {State as StatesState} from './state.reducer';
import {State as ApproxState} from './approximate.reducer';
import {State as EquipState} from './equipment.reducer';
import {State as SkillState} from './skill.reducer';
import {State as CategoryState} from './category.reducer';
import {State as TopicState} from './topic.reducer';
import {Dictionary} from '@ngrx/entity';

export const getValueState = createFeatureSelector<ValueState>('values');
export const selectStatesState = createFeatureSelector<StatesState>('states');
export const getApproxState = createFeatureSelector<ApproxState>('approximates');
export const getEquipState = createFeatureSelector<EquipState>('equipments');
export const getSkillState = createFeatureSelector<SkillState>('skills');
export const getCategoryState = createFeatureSelector<CategoryState>('categories');
export const getTopicState = createFeatureSelector<TopicState>('topics');

export const getValues = createSelector(
  getValueState,
  (state: ValueState): Values => state.values
);
export const getValuesIsLoading = createSelector(
  getValueState,
  (state: ValueState): boolean => state.isLoading);

export const getValuesTimestamp = createSelector(getValueState, (state: ValueState): number => state.timestamp);

export const getTravelCostFactor = createSelector(
  getValues, (values: Values): number => values.travelCostFactor
);

export const getAccommodationCostMaximum = createSelector(
  getValues, (values: Values): number => values.accommodationCostMaximum
);

export const getAccommodationCostDefault = createSelector(
  getValues, (values: Values): number => values.accommodationCostDefault
);

export const getTourCalculationValues = createSelector(
  getValues, (values: Values): TourCalculation => values.tourCalculationValues
);

export const getOpeningHours = createSelector(
  getValues, (values: Values): OpeningHours => values.openingHours
);

export const getStates = createSelector(selectStatesState, (state: Dictionary<any>): RawState => state.entities);

export const getTopicById = (topicId: number) => createSelector(
  getTopicState, topicState => topicState.entities[topicId]
);

export const getCategoryById = (categoryId: number) => createSelector(
  getCategoryState, categoryState => categoryState.entities[categoryId]
);

export const getApproximateById = (approximateId: number) => createSelector(
  getApproxState, approximateState => approximateState.entities[approximateId]
);
