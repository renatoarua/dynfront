import { createSelector } from '@ngrx/store';
import { Project, Machine, MachineError } from '../models/shaft';
import { Cart } from '../models/payment'
import { User } from '../models/user';
import { AppStatus, ProjectStatus, SearchCriteria, EditorState, CollectionState, UIState, AppState } from './models';

import * as _ from 'lodash';

import * as fromActions from './actions';

/*
 * UI REDUCER
 *
 */
const initialInfo: UIState = {
  user: null,
  error: null,
  status: 'loading',
  cart: null,
  units: 'metric'
}

export function UIReducer(state: UIState = initialInfo, action: fromActions.UIActions): UIState {
  switch (action.type) {
    case fromActions.UI_GET_USER:
      return Object.assign({}, state, {
        user: null,
        status: 'searching'
      });
    case fromActions.UI_GET_USER_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload,
        status: 'ready'
      });
    case fromActions.UI_GET_USER_FAILURE:
      return Object.assign({}, state, {
        user: null,
        error: action.payload,
        status: 'ready'
      });
    case fromActions.UI_SET_ERROR:
      return Object.assign({}, state, {
        error: action.payload,
      });
    case fromActions.UI_FIX_ERROR:
      return Object.assign({}, state, {
        error: null,
      });
    case fromActions.UI_SET_STATUS:
      return Object.assign({}, state, {
        status: action.payload,
      });

    case fromActions.UI_ADD_TO_CART:
      return Object.assign({}, state, {
        cart: {plan: action.payload, total:action.payload.price, checkout:''},
      });
    case fromActions.UI_CLEAR_CART:
      return Object.assign({}, state, {
        cart: null,
      });
    case fromActions.UI_CHECKOUT_REQUEST:
      return state;
    case fromActions.UI_CHECKOUT_SUCCESS:
      return state;
    case fromActions.UI_CHECKOUT_FAILURE:
      return Object.assign({}, state, {
        error: action.payload,
      });

    case fromActions.UI_CHANGE_UNITS:
      return Object.assign({}, state, {
        units: action.payload
      });

    default:
      return state;
  }
}

export const getUIState = (state: AppState) => state.uiState;
export const getStatusUI = (state: UIState) => state.status;
export const getUserUI = (state: UIState) => state.user;
export const getErrorUI = (state: UIState) => state.error;

export const getCartUI = (state: UIState) => state.cart;

export const getUIStatus = createSelector(getUIState, getStatusUI);
export const getUser = createSelector(getUIState, getUserUI);
export const getError = createSelector(getUIState, getErrorUI);
export const getCart = createSelector(getUIState, getCartUI);

export const hasUser = createSelector(
  getUser,
  (user: User) => {
    return user !== null;
  });

export const isLoading = createSelector(
  getUIStatus,
  (status: AppStatus) => {
    return status === 'loading';
  });

export const hasError = createSelector(
  getError,
  (error: string) => {
    return error != null && error != "";
  });


/*
 * PROJECT REDUCER
 *
 */
const initialCollection: CollectionState = {
  criteria: null,
  status: 'ready',
  results: []
};

// the "projects" reducer performs actions on our lists of projects
export function ProjectReducer(state: CollectionState = initialCollection, action: fromActions.ProjectsActions): CollectionState {
  switch (action.type) {
    case fromActions.COLLECTION_GET_PROJECTS:
      // payload SearchCriteria
      // console.log('[1] GetProjects');
      return Object.assign({}, state, {
        criteria: action.payload || {},
        status: 'searching',
        results: null
      });
    case fromActions.COLLECTION_GET_PROJECTS_SUCCESS:
      // payload Project[]
      // console.log('[2] GetProjects Success');
      return Object.assign({}, state, {
        status: action.payload.length > 0 ? 'complete' : 'empty',
        results: action.payload.map(val => Project.Create(val))
      });
      //_.keyBy(payload, 'projectId')
    case fromActions.COLLECTION_PROJECTS_SEARCH_CRITERIA:
      // payload SearchCriteria
      return Object.assign({}, state, {
        criteria: action.payload || {}
      });
    case fromActions.COLLECTION_CLEAR_PROJECTS:
      // payload none
      return initialCollection

    case fromActions.COLLECTION_CREATE_PROJECT:
    case fromActions.COLLECTION_UPDATE_PROJECT:
    case fromActions.COLLECTION_DELETE_PROJECT:
      return state;
    case fromActions.COLLECTION_CREATE_PROJECT_SUCCESS:
      // payload Project
      return Object.assign({}, state, {
        results: [ ...state.results, action.payload ],
      });

    case fromActions.COLLECTION_UPDATE_PROJECT_SUCCESS:
      // payload Project
      console.log("9c) merge all ", action.payload);
      return Object.assign({}, state, {
        results: state.results.map(item => {
          return item.projectId === action.payload.projectId ? Project.Create(action.payload) : item;
        })
      });
    case fromActions.COLLECTION_DELETE_PROJECT_SUCCESS:
      // payload ProjectID string
      return Object.assign({}, state, {
        results: state.results.filter(item => {
          return item.projectId !== action.payload;
        })
      });
    default:
      return state;
  }
};

export const getCollectionState = (state: AppState) => state.collection;
export const getCollectionCriteria = (state: CollectionState) => state.criteria;
export const getCollectionStatus = (state: CollectionState) => state.status;
export const getCollectionLoadSuccess = (state: CollectionState) => state.status === 'complete' || state.status === 'empty';
export const getCollectionLoading = (state: CollectionState) => state.status === 'loading';
export const getCollectionSearching = (state: CollectionState) => state.status === 'searching';
export const getCollectionResults = (state: CollectionState) => state.results;

export const getCriteria = createSelector(getCollectionState, getCollectionCriteria);
export const getAppStatus = createSelector(getCollectionState, getCollectionStatus);
export const getAppIsLoading = createSelector(getCollectionState, getCollectionLoading);
export const getAppIsSearching = createSelector(getCollectionState, getCollectionSearching);

export const getCollectionLoaded = createSelector(getCollectionState, getCollectionLoadSuccess);
export const getAllResults = createSelector(getCollectionState, getCollectionResults);


/*
 * EDITOR REDUCER
 *
 */
const initialEditor: EditorState = {
  status: 'empty',
  project: null,
  errors: []
};

export const getProjectById = (projectId) => createSelector(
  getAllResults,
  (projects: Project[]) => {
    // return projects[projectId];
    return projects.find(obj => obj.projectId == projectId);
    // return projects.filter((x:Project) => x.projectId === projectId)[0];
  });

// the "editor" reducer handles the currently selected Project
export function EditorReducer(state: EditorState = initialEditor, action: fromActions.EditorActions): EditorState {
  switch(action.type) {
    case fromActions.EDITOR_SELECT_PROJECT:
      return Object.assign({}, state, {
        status: 'empty',
      });
    case fromActions.EDITOR_SELECT_PROJECT_SUCCESS:
      // payload Project
      // oholder.project = state.projects.find(x => x.projectId == payload);
      return Object.assign({}, state, {
        status: 'ready',
        project: action.payload
      });
    case fromActions.EDITOR_CLOSE_PROJECT:
      return initialEditor;

    // not undoable update
    case fromActions.EDITOR_UPDATE_MACHINE_FIX:
      // payload Machine
      let f = Object.assign({}, state.project, {
        machine: action.payload
      });
      console.log("10) store merge, again", f);
      return Object.assign({}, state, {
        project: f
      });

    // undoable actions
    case fromActions.EDITOR_UPDATE_MACHINE:
      // payload Machine
      let p = Object.assign({}, state.project, {
        machine: action.payload
      });
      console.log("7) store merge", p);
      return Object.assign({}, state, {
        project: p
      });
    case fromActions.EDITOR_UPDATE_SETTINGS:
      // payload ProjectSetting
      let s = Object.assign({}, state.project, {
        projectsetting: action.payload
      });
      return Object.assign({}, state, {
        project: s
      });

    case fromActions.EDITOR_UPDATE_MACHINE_FAILURE:
    case fromActions.EDITOR_UPDATE_MACHINE_SUCCESS:
    case fromActions.EDITOR_SAVE_PROJECT_FAILURE:
    case fromActions.EDITOR_SAVE_PROJECT_SUCCESS:
      // payload MachineError
      return Object.assign({}, state, {
        errors: action.payload
      });


    default:
      return state;
  }
};

export const getEditorState = (state: AppState) => state.editor;
export const getEditorStatus = (state: EditorState) => state.status;
export const getEditorProject = (state: EditorState) => state.project;
export const getErrors = (state: EditorState) => state.errors;
export const getProjectStatus = createSelector(getEditorState, getEditorStatus);
export const getSelectedProject = createSelector(getEditorState, getEditorProject);
export const getEditorErrors = createSelector(getEditorState, getErrors);

export const hasSelectedProject = createSelector(
  getProjectStatus,
  (status: ProjectStatus) => {
    return status === 'ready';
  });

export const hasErrors = createSelector(
  getEditorErrors,
  (errors: MachineError[]) => {
    return errors.length > 0;
  });