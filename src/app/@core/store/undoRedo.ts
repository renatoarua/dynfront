import { ActionReducer, Action } from '@ngrx/store';
import * as fromActions from './actions';

export type UndoActions = { type: 'UNDO_STATE' } | { type: 'REDO_STATE' };
/*
with config
undoRedo({
  maxBufferSize: 15,
  // undo/redo can be applyied only on ADD_ITEM/REMOVE_ITEM result state,
  allowedActions: [{ type: EDITOR_UPDATE_MACHINE }, { type: EDITOR_UPDATE_SETTINGS }],
  undoActionType: UNDO,
  redoActionType: REDO
})*/
export function undoRedo<T>( reducer: ActionReducer<T> ): ActionReducer<T> {

    const allowedActions = [{ type: fromActions.EDITOR_UPDATE_MACHINE }, { type: fromActions.EDITOR_UPDATE_SETTINGS }],
        maxBufferSize = 15,
        undoActionType = 'UNDO',
        redoActionType = 'REDO';

    let undoState: UndoState<T> = {
        past: [],
        present: reducer(undefined, {} as Action),
        future: [],
        changes: 0,
    }

    // return (state, action) => {
    return function newReducer( state, action ) {
        let nextState: T;
        switch (action.type) {
            case undoActionType: {
                nextState = undoState.past[0];
                if (!nextState) {
                    return state;
                }
                undoState = {
                    past: [...undoState.past.slice(1)],
                    present: undoState.past[0],
                    future: [undoState.present, ...undoState.future],
                    changes: undoState.changes
                }
                return nextState;
            }
            case redoActionType: {
                nextState = undoState.future[0];
                if (!nextState) {
                    return state;
                }
                undoState = {
                    past: [undoState.present, ...undoState.past],
                    present: nextState,
                    future: [...undoState.future.slice(1)],
                    changes: undoState.changes
                }
                return nextState
            }
        }

        nextState = reducer(state, action);
        if (allowedActions && allowedActions.some((a) => a.type === action.type)) {

            const nextChanged = undoState.changes + 1;

            undoState = {
                past: [undoState.present, ...undoState.past.slice(0, maxBufferSize - 1)],
                present: nextState,
                future: [...undoState.future.slice(0, maxBufferSize - 1)],
                changes: nextChanged
            }
        }
        return nextState;
    }
}


// export const undoRedo2 = (config?: Config) => <T>(reducer: ActionReducer<T>) => undoReducer(reducer, config);
export const undoReducer2 = <T>(reducer: ActionReducer<T>, config: Config = {}): ActionReducer<T> => {

    const allowedActions = config.allowedActions,
        maxBufferSize = config.maxBufferSize || 5,
        undoActionType = config.undoActionType || 'UNDO_STATE',
        redoActionType = config.redoActionType || 'REDO_STATE';

    let undoState: UndoState<T> = {
        past: [],
        present: reducer(undefined, {} as Action),
        future: [],
        changes: 0,
    }

    return (state, action) => {
        let nextState: T;
        switch (action.type) {
            case undoActionType: {
                nextState = undoState.past[0];
                if (!nextState) {
                    return state;
                }
                undoState = {
                    past: [...undoState.past.slice(1)],
                    present: undoState.past[0],
                    future: [undoState.present, ...undoState.future],
                    changes: undoState.changes
                }
                return nextState;
            }
            case redoActionType: {
                nextState = undoState.future[0];
                if (!nextState) {
                    return state;
                }
                undoState = {
                    past: [undoState.present, ...undoState.past],
                    present: nextState,
                    future: [...undoState.future.slice(1)],
                    changes: undoState.changes
                }
                return nextState
            }
        }

        nextState = reducer(state, action);
        if (!config.allowedActions || (allowedActions && allowedActions.some((a) => a.type === action.type))) {

            const nextChanged = undoState.changes + 1;

            undoState = {
                past: [undoState.present, ...undoState.past.slice(0, maxBufferSize - 1)],
                present: nextState,
                future: [...undoState.future.slice(0, maxBufferSize - 1)],
                changes: nextChanged
            }
        }
        return nextState;
    }
}

export interface UndoState<T> {
    past: T[];
    present: T;
    future: T[];
    changes: number;
}

export interface Config {
    maxBufferSize?: number;
    allowedActions?: Action[];
    undoActionType?: string;
    redoActionType?: string;
}