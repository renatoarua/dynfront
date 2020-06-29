import { Component } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: 'ngx-not-found',
    templateUrl: '404.component.html',
    styleUrls: ['./404.component.scss'],
})
export class P404Component {

    constructor(private _router:Router) { }

	goToHome() {
		this._router.navigate(['/']);
		// this.menuService.navigateHome();
	}
}
