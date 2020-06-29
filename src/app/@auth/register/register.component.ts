import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Router } from "@angular/router";

// import { StaffService } from '../../@core/services/staff.service';
import { UserService } from '../../@core/services/user.service';

import { socialLinks } from '../../../environments/environment';

@Component({
  selector: 'dyn-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {   
    signupForm: FormGroup;
    formErrors: any;
    submitted: boolean = false;
    errorMessage: string = '';
    showConfirmation: boolean = false;

    socialLinks: any;

    constructor(private _userService:UserService,
                private _router:Router,
                private _fb:FormBuilder) {

        const password = new FormControl(
            '',
            Validators.compose([Validators.required, Validators.minLength(6)])
        );
        const passwordConfirm = new FormControl(
            '',
            Validators.compose([
                Validators.required,
                CustomValidators.equalTo(password)
            ])
        );

        this.signupForm = _fb.group({
            username: [
                '',
                Validators.compose([
                    Validators.required,
                    CustomValidators.rangeLength([3, 25]),
                    Validators.pattern('^[A-Za-z0-9_-]{3,25}$')
                ])
            ],
            email: [
                '',
                Validators.compose([Validators.required, CustomValidators.email])
            ],
            password: password,
            confirmPassword: passwordConfirm, // use standalone variable to use equalTo
        });
            // terms: ['', Validators.required],

        this.signupForm.valueChanges.subscribe(data => this.onValueChanged(data));

        this.socialLinks = socialLinks;
    }

    setFormErrors(errorFields:any):void{
        for (const key in errorFields) {
            // skip loop if the property is from prototype
            if (!errorFields.hasOwnProperty(key)) {
                continue;
            }

            const message = errorFields[key];
            this.formErrors[key].valid = false;
            this.formErrors[key].message = message;
        }
    }

    resetFormErrors():void{
        this.formErrors = {
            email: {valid: true, message: ''},
            username: {valid: true, message: ''},
            password: {valid: true, message: ''},
            confirmPassword: {valid: true, message: ''}
        };
            // terms: {valid: true, message: ''},
    }

    private isValid(field):boolean {
        let isValid: boolean = false;

        // If the field is not touched and invalid, it is considered as initial loaded form. Thus set as true
        if (this.signupForm.controls[field].touched === false) {
            isValid = true;
        } else if (
            // If the field is touched and valid value, then it is considered as valid.
            this.signupForm.controls[field].touched === true &&
            this.signupForm.controls[field].valid === true
        ) {
            isValid = true;
        }
        return isValid;
    }

    onValueChanged(data?: any) {
        if (!this.signupForm) {
            return;
        }
        const form = this.signupForm;
        for (const field of Object.keys(this.formErrors)) {
            // clear previous error message (if any)
            const control = form.get(field);
            if (control && control.dirty) {
                this.formErrors[field].valid = true;
                this.formErrors[field].message = '';
            }
        }
    }

    ngOnInit() {
        this.resetFormErrors();
        this._userService.logout();
    }

    onSubmit(elementValues: any) {
        this.submitted = true;
        this._userService
            .signup(
                elementValues.username,
                elementValues.email,
                elementValues.password
            )
            .subscribe(
                result => {
                    if (result.success) {
                        // show confirmation dialog
                        this.showConfirmation = true;
                    } else {
                        this.errorMessage =
                            'Registration is failed. Please check and try again.';
                        this.submitted = false;
                    }
                },
                error => {
                    this.submitted = false;
                    // Validation error
                    if (error.status === 422) {
                        this.resetFormErrors();
                        // this.errorMessage = "There was an error on submission. Please check again.";
                        const errorFields = JSON.parse(error.data.message);
                        this.setFormErrors(errorFields);
                    } else {
                        this.errorMessage = error.data;
                    }
                }
            );
    }
}