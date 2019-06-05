import {createFeatureSelector, createSelector} from '@ngrx/store';
import {State, selectAll} from './instruction.reducer';

export const getInstructionState = createFeatureSelector<State>('instructions');
export const getInstructionById = (instructionId: number) => createSelector(
  getInstructionState, instructionState => instructionState.entities[instructionId]
);