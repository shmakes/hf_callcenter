/// <reference path="../../typings/angular2-meteor.d.ts" />
 
import {Component, View} from 'angular2/core';

import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
 
import {CallCenters} from 'collections/call_centers';

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
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            flightName: ['', Validators.required]
        });
    }

    addCallCenter(call_center) {
        if (this.callCentersForm.valid) {
            CallCenters.insert({
                name: call_center.name,
                startDate: call_center.startDate,
                endDate: call_center.endDate,
                flightName: call_center.flightName
            });
 
            (<Control>this.callCentersForm.controls['name']).updateValue('');
            (<Control>this.callCentersForm.controls['startDate']).updateValue('');
            (<Control>this.callCentersForm.controls['endDate']).updateValue('');
            (<Control>this.callCentersForm.controls['flightName']).updateValue('');
        }
    }
}
