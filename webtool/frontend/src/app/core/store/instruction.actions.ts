import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Instruction } from './instruction.model';

export enum InstructionActionTypes {
  InstructionNotModified = '[Instruction] Instruction not modified',
  RequestInstruction = '[Instruction] Request Instruction',
  LoadInstructions = '[Instruction] Load Instructions',
  AddInstruction = '[Instruction] Add Instruction',
  UpsertInstruction = '[Instruction] Upsert Instruction',
  AddInstructions = '[Instruction] Add Instructions',
  UpsertInstructions = '[Instruction] Upsert Instructions',
  UpdateInstruction = '[Instruction] Update Instruction',
  UpdateInstructions = '[Instruction] Update Instructions',
  DeleteInstruction = '[Instruction] Delete Instruction',
  DeleteInstructions = '[Instruction] Delete Instructions',
  ClearInstructions = '[Instruction] Clear Instructions'
}

export class RequestInstruction implements Action {
  readonly type = InstructionActionTypes.RequestInstruction;

  constructor(public payload: { id: number }) {}
}

export class InstructionNotModified implements Action {
  readonly type = InstructionActionTypes.InstructionNotModified;
}

export class LoadInstructions implements Action {
  readonly type = InstructionActionTypes.LoadInstructions;

  constructor(public payload: { instructions: Instruction[] }) {}
}

export class AddInstruction implements Action {
  readonly type = InstructionActionTypes.AddInstruction;

  constructor(public payload: { instruction: Instruction }) {}
}

export class UpsertInstruction implements Action {
  readonly type = InstructionActionTypes.UpsertInstruction;

  constructor(public payload: { instruction: Instruction }) {}
}

export class AddInstructions implements Action {
  readonly type = InstructionActionTypes.AddInstructions;

  constructor(public payload: { instructions: Instruction[] }) {}
}

export class UpsertInstructions implements Action {
  readonly type = InstructionActionTypes.UpsertInstructions;

  constructor(public payload: { instructions: Instruction[] }) {}
}

export class UpdateInstruction implements Action {
  readonly type = InstructionActionTypes.UpdateInstruction;

  constructor(public payload: { instruction: Update<Instruction> }) {}
}

export class UpdateInstructions implements Action {
  readonly type = InstructionActionTypes.UpdateInstructions;

  constructor(public payload: { instructions: Update<Instruction>[] }) {}
}

export class DeleteInstruction implements Action {
  readonly type = InstructionActionTypes.DeleteInstruction;

  constructor(public payload: { id: number }) {}
}

export class DeleteInstructions implements Action {
  readonly type = InstructionActionTypes.DeleteInstructions;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearInstructions implements Action {
  readonly type = InstructionActionTypes.ClearInstructions;
}

export type InstructionActions =
  RequestInstruction
  | InstructionNotModified
  | LoadInstructions
  | AddInstruction
  | UpsertInstruction
  | AddInstructions
  | UpsertInstructions
  | UpdateInstruction
  | UpdateInstructions
  | DeleteInstruction
  | DeleteInstructions
  | ClearInstructions;
