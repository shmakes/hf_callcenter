/// <reference path="../../typings/angular2-meteor.d.ts" />
 
import {Component, View} from 'angular2/core';

import {FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
 
@Component({
  selector: 'call_centers-form'
})

@View({
  templateUrl: 'client/call_centers-form/call_centers-form.html',
  directives: [FORM_DIRECTIVES]
})

export class CallCentersForm {
    callCentersForm: ControlGroup;
 
    constructor() {
        var fb = new FormBuilder();
        this.callCentersForm = fb.group({
            name: ['', Validators.required],
            orgName: [''],
            flightName: ['']
        });
    }
}
