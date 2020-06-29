import { Observable, Subject } from 'rxjs/Rx';

// export interface IModalDialog {
//   dialogInit: (reference: ComponentRef<IModalDialog>, options: Partial<IModalDialogOptions<any>>) => void;
// }

export interface ModalComponent {
	data: any;
	// dialogInit: (closeDialogSubject: Subject<void>) => void;
	closingSubject$: Subject<void>;
	// onClose: () => Promise<any> | Observable<any> | boolean;
}