import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MachineSetupError } from './machine-setup.error';
import { MachineError } from '../models/shaft';

import { ProjectService } from '../services/project.service';

/*
Example

this.countryService.addCountry(country)
 .subscribe(data => {
     console.log(data);
   },
   err => {
     throw err;
   }
 );
*/

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  
  constructor(private injector: Injector) {}

  // let router = this.injector.get(Router);
  // console.log('URL: ' + router.url);

  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      //Backend returns unsuccessful response codes such as 404, 500 etc.
      console.error('Backend returned status code: ', error.status);
      console.error('Response body:', error.message);
    } else if(error instanceof MachineSetupError) {
      console.warn("There is a problem in the machine's setup:", error.message);
      let _ps = this.injector.get(ProjectService);
      _ps.debugInfo();
    } else {
      //A client-side or network error occurred.	          
      console.error('An error occurred:', error.message);
    }     
  }
}
