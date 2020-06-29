import { Project, MachineError } from '../models/shaft';
import { Cart } from '../models/payment';
import { User } from '../models/user';

export type AppStatus = 'ready' | 'empty' | 'searching' | 'complete' | 'loading';
export type ProjectStatus = 'ready' | 'empty' | 'saving';

export interface SearchCriteria {
  userId: number;
}

export interface EditorState {
  status: ProjectStatus;
  project: Project;
  errors: MachineError[];
}

export interface CollectionState {
  status: AppStatus;
  criteria: SearchCriteria;
  results: Project[];
}
// results:  { [key:string]: Project };

export interface UIState {
  user: User;
  error?: string;
  status: AppStatus;
  cart: Cart;
  units: string;
}

export interface AppState {
  uiState: UIState,
  collection: CollectionState,
  editor: EditorState
}


/*const initialUiState: UIState = {
  userId: undefined,
  currentProjectId: undefined
}

const initialApp: AppState {
  uiState: initialUiState,
  project: initialProject,
  editor: initialHolder
}

function newAppState(state: AppState = initialApp, action: Action): AppState {
  return {
    uiState: createNewUiState(state.uiState, action),
    project: createNewProjectState(state.project, action),
    editor: createNewEditorState(state.editor, action)
  }
}*/