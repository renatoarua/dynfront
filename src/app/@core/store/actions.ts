import { Action } from '@ngrx/store';
import { Project, Machine, ProjectSetting } from '../models/shaft';
import { Cart, Plan } from '../models/payment'
import { User } from '../models/user';
import { SearchCriteria, AppStatus } from './models';

/*
 PROJECT: Collection of projects loaded
*/
export const COLLECTION_GET_PROJECTS 			 = '[Collection] Get Projects';
export const COLLECTION_GET_PROJECTS_SUCCESS 	 = '[Collection] Get Projects Success';
export const COLLECTION_GET_PROJECTS_FAILURE 	 = '[Collection] Get Projects Failure';
export const COLLECTION_PROJECTS_SEARCH_CRITERIA = '[Collection] Projects Search Criteria';
export const COLLECTION_CLEAR_PROJECTS 			 = '[Collection] Clear Projects';
export const COLLECTION_CREATE_PROJECT 			 = '[Collection] Create Project';
export const COLLECTION_CREATE_PROJECT_SUCCESS 	 = '[Collection] Create Project Success';
export const COLLECTION_CREATE_PROJECT_FAILURE 	 = '[Collection] Create Project Failure';
export const COLLECTION_UPDATE_PROJECT 			 = '[Collection] Update Project';
export const COLLECTION_UPDATE_PROJECT_SUCCESS 	 = '[Collection] Update Project Success';
export const COLLECTION_UPDATE_PROJECT_FAILURE 	 = '[Collection] Update Project Failure';
export const COLLECTION_DELETE_PROJECT 			 = '[Collection] Delete Project';
export const COLLECTION_DELETE_PROJECT_SUCCESS 	 = '[Collection] Delete Project Success';
export const COLLECTION_DELETE_PROJECT_FAILURE 	 = '[Collection] Delete Project Failure';

export class CollectionGetProjects implements Action {
  readonly type = COLLECTION_GET_PROJECTS;
  constructor(public payload: SearchCriteria) {}
}
export class CollectionGetProjectsSuccess implements Action {
  readonly type = COLLECTION_GET_PROJECTS_SUCCESS;
  constructor(public payload: Project[]) {}
}
export class CollectionGetProjectsFailure implements Action {
  readonly type = COLLECTION_GET_PROJECTS_FAILURE;
  constructor(public payload: any) {}
}
export class CollectionProjectsSearchCriteria implements Action {
	readonly type = COLLECTION_PROJECTS_SEARCH_CRITERIA;
	constructor(public payload: SearchCriteria) {}
}
export class CollectionClearProjects implements Action {
	readonly type = COLLECTION_CLEAR_PROJECTS;
}
export class CollectionCreateProject implements Action {
	readonly type = COLLECTION_CREATE_PROJECT;
}
export class CollectionCreateProjectSuccess implements Action {
	readonly type = COLLECTION_CREATE_PROJECT_SUCCESS;
	constructor(public payload: Project) {}
}
export class CollectionCreateProjectFailure implements Action {
	readonly type = COLLECTION_CREATE_PROJECT_FAILURE;
	constructor(public payload: any) {}
}
export class CollectionUpdateProject implements Action {
	readonly type = COLLECTION_UPDATE_PROJECT;
}
export class CollectionUpdateProjectSuccess implements Action {
	readonly type = COLLECTION_UPDATE_PROJECT_SUCCESS;
	constructor(public payload: Project) {}
}
export class CollectionUpdateProjectFailure implements Action {
	readonly type = COLLECTION_UPDATE_PROJECT_FAILURE;
	constructor(public payload: any) {}
}
export class CollectionDeleteProject implements Action {
	readonly type = COLLECTION_DELETE_PROJECT;
	constructor(public payload: string) {}
}
export class CollectionDeleteProjectSuccess implements Action {
	readonly type = COLLECTION_DELETE_PROJECT_SUCCESS;
	constructor(public payload: any) {}
}
export class CollectionDeleteProjectFailure implements Action {
	readonly type = COLLECTION_DELETE_PROJECT_FAILURE;
	constructor(public payload: any) {}
}

export type ProjectsActions
	= CollectionGetProjects
	| CollectionGetProjectsSuccess
	| CollectionGetProjectsFailure
	| CollectionProjectsSearchCriteria
	| CollectionClearProjects
	| CollectionCreateProject
	| CollectionCreateProjectSuccess
	| CollectionCreateProjectFailure
	| CollectionUpdateProject
	| CollectionUpdateProjectSuccess
	| CollectionUpdateProjectFailure
	| CollectionDeleteProject
	| CollectionDeleteProjectSuccess
	| CollectionDeleteProjectFailure;


/*
	EDITOR: Selected project
*/
export const EDITOR_SELECT_PROJECT		 	 = '[Editor] Select Project';
export const EDITOR_SELECT_PROJECT_SUCCESS   = '[Editor] Select Project Success';
export const EDITOR_SELECT_PROJECT_FAILURE   = '[Editor] Select Project Failure';
export const EDITOR_CLOSE_PROJECT			 = '[Editor] Close Project';
export const EDITOR_CLOSE_PROJECT_SUCCESS	 = '[Editor] Close Project Success';
export const EDITOR_CLOSE_PROJECT_FAILURE	 = '[Editor] Close Project Failure';
export const EDITOR_SAVE_PROJECT			 = '[Editor] Save Project';
export const EDITOR_SAVE_PROJECT_SUCCESS	 = '[Editor] Save Project Success';
export const EDITOR_SAVE_PROJECT_FAILURE	 = '[Editor] Save Project Failure';
export const EDITOR_UPDATE_MACHINE_FIX       = '[Editor] Update Machine Fix';
export const EDITOR_UPDATE_MACHINE		  	 = '[Editor] Update Machine';
export const EDITOR_UPDATE_MACHINE_SUCCESS   = '[Editor] Update Machine Success';
export const EDITOR_UPDATE_MACHINE_FAILURE   = '[Editor] Update Machine Failure';
export const EDITOR_UPDATE_SETTINGS		  	 = '[Editor] Update Settings';
export const EDITOR_UPDATE_SETTINGS_SUCCESS  = '[Editor] Update Settings Success';
export const EDITOR_UPDATE_SETTINGS_FAILURE  = '[Editor] Update Settings Failure';


export class EditorSelectProject implements Action {
	readonly type = EDITOR_SELECT_PROJECT;
	constructor(public payload: string) {}
}
export class EditorSelectProjectSuccess implements Action {
	readonly type = EDITOR_SELECT_PROJECT_SUCCESS;
	constructor(public payload: Project) {}
}
export class EditorSelectProjectFailure implements Action {
	readonly type = EDITOR_SELECT_PROJECT_FAILURE;
	constructor(public payload: any) {}
}
export class EditorCloseProject implements Action {
	readonly type = EDITOR_CLOSE_PROJECT;
}
export class EditorCloseProjectSuccess implements Action {
	readonly type = EDITOR_CLOSE_PROJECT_SUCCESS;
	constructor(public payload: any) {}
}
export class EditorCloseProjectFailure implements Action {
	readonly type = EDITOR_CLOSE_PROJECT_FAILURE;
	constructor(public payload: any) {}
}
export class EditorSaveProject implements Action {
	readonly type = EDITOR_SAVE_PROJECT;
}
export class EditorSaveProjectSuccess implements Action {
	readonly type = EDITOR_SAVE_PROJECT_SUCCESS;
	constructor(public payload: any) {}
}
export class EditorSaveProjectFailure implements Action {
	readonly type = EDITOR_SAVE_PROJECT_FAILURE;
	constructor(public payload: any) {}
}
export class EditorUpdateMachineFix implements Action {
	readonly type = EDITOR_UPDATE_MACHINE_FIX;
	constructor(public payload: Machine) {}
}
export class EditorUpdateMachine implements Action {
	readonly type = EDITOR_UPDATE_MACHINE;
	constructor(public payload: Machine) {}
}
export class EditorUpdateMachineSuccess implements Action {
	readonly type = EDITOR_UPDATE_MACHINE_SUCCESS;
	constructor(public payload: any) {}
}
export class EditorUpdateMachineFailure implements Action {
	readonly type = EDITOR_UPDATE_MACHINE_FAILURE;
	constructor(public payload: any) {}
}
export class EditorUpdateSettings implements Action {
	readonly type = EDITOR_UPDATE_SETTINGS;
	constructor(public payload: ProjectSetting) {}
}
export class EditorUpdateSettingsSuccess implements Action {
	readonly type = EDITOR_UPDATE_SETTINGS_SUCCESS;
	constructor(public payload: any) {}
}
export class EditorUpdateSettingsFailure implements Action {
	readonly type = EDITOR_UPDATE_SETTINGS_FAILURE;
	constructor(public payload: any) {}
}

export const UNDO = '[Editor] Undo Action';
export const REDO = '[Editor] Redo Action';

export class EditorUndo implements Action {
	readonly type = UNDO;
}
export class EditorRedo implements Action {
	readonly type = REDO;
}

export type EditorActions
	= EditorSelectProject
	| EditorSelectProjectSuccess
	| EditorSelectProjectFailure
	| EditorCloseProject
	| EditorCloseProjectSuccess
	| EditorCloseProjectFailure
	| EditorSaveProject
	| EditorSaveProjectSuccess
	| EditorSaveProjectFailure
	| EditorUpdateMachineFix
	| EditorUpdateMachine
	| EditorUpdateMachineSuccess
	| EditorUpdateMachineFailure
	| EditorUpdateSettings
	| EditorUpdateSettingsSuccess
	| EditorUpdateSettingsFailure
	| EditorUndo
	| EditorRedo;


// export const ADD_MACHINE    = 'ADD_MACHINE';
// export const ADD_SECTION    = 'ADD_SECTION';
// export const ADD_DISC       = 'ADD_DISC';
// export const ADD_RIB        = 'ADD_RIB';
// export const ADD_INERTIA    = 'ADD_INERTIA';
// export const ADD_ROLLER     = 'ADD_ROLLER';
// export const ADD_JOURNAL    = 'ADD_JOURNAL';
// export const ADD_FOUNDATION = 'ADD_FOUNDATION';
// export const ADD_VES        = 'ADD_VES';
// export const ADD_ABS        = 'ADD_ABS';


export const UI_GET_USER			 	 = '[UI] Get User';
export const UI_GET_USER_SUCCESS 		 = '[UI] Get User Success';
export const UI_GET_USER_FAILURE		 = '[UI] Get User Failure';
export const UI_SET_ERROR				 = '[UI] Set Error';
export const UI_FIX_ERROR				 = '[UI] Fix Error';
export const UI_SET_STATUS				 = '[UI] Set Status';

export const UI_ADD_TO_CART				 = '[UI] Add to Cart';
export const UI_CLEAR_CART				 = '[UI] Clear Cart';
export const UI_CHECKOUT_REQUEST		 = '[UI] Checkout Request';
export const UI_CHECKOUT_SUCCESS		 = '[UI] Checkout Success';
export const UI_CHECKOUT_FAILURE		 = '[UI] Checkout Failure';

export const UI_CHANGE_UNITS             = '[UI] Set Units';

export class UIGetUser implements Action {
	readonly type = UI_GET_USER;
	constructor(public payload: number) {}
}
export class UIGetUserSuccess implements Action {
	readonly type = UI_GET_USER_SUCCESS;
	constructor(public payload: User) {}
}
export class UIGetUserFailure implements Action {
	readonly type = UI_GET_USER_FAILURE;
	constructor(public payload: string) {}
}
export class UISetError implements Action {
	readonly type = UI_SET_ERROR;
	constructor(public payload: string) {}
}
export class UIFixError implements Action {
	readonly type = UI_FIX_ERROR;
	// constructor(public payload: string) {}
}
export class UISetStatus implements Action {
	readonly type = UI_SET_STATUS;
	constructor(public payload: AppStatus | string) {}
}

export class UIAddToCart implements Action {
	readonly type = UI_ADD_TO_CART;
	constructor(public payload: Plan) {}
}
export class UIClearCart implements Action {
	readonly type = UI_CLEAR_CART;
	// constructor(public payload: string) {}
}
export class UICheckout implements Action {
	readonly type = UI_CHECKOUT_REQUEST;
	constructor(public payload: any) {}
}
export class UICheckoutSuccess implements Action {
	readonly type = UI_CHECKOUT_SUCCESS;
	constructor(public payload: any) {}
}
export class UICheckoutFailure implements Action {
	readonly type = UI_CHECKOUT_FAILURE;
	constructor(public payload: any) {}
}

export class UIChangeUnits implements Action {
	readonly type = UI_CHANGE_UNITS;
	constructor(public payload: string) {}
}

export type UIActions
	= UIGetUser
	| UIGetUserSuccess
	| UIGetUserFailure
	| UISetError
	| UIFixError
	| UISetStatus
	| UIAddToCart
	| UIClearCart
	| UICheckout
	| UICheckoutSuccess
	| UICheckoutFailure
	| UIChangeUnits;