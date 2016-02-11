import {Component, View} from 'angular2/core';
import {FORM_DIRECTIVES, FormBuilder, Control, ControlGroup, Validators} from 'angular2/common';
import {VeteranCallSheets} from 'collections/veteran_call_sheets';
import {RouterLink, RouteParams, Router} from 'angular2/router';
import {RequireUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'call_sheet_veteran'
})

@View({
  templateUrl: '/client/call_sheet_veteran/call_sheet_veteran.html',
  directives: [RouterLink, FORM_DIRECTIVES]
})

@RequireUser()
export class VeteranCallSheet extends MeteorComponent {
  veteranCallSheetForm: ControlGroup;
  veteranCallSheet: VeteranCallSheet;

  constructor(params: RouteParams, private _router: Router) {
    super();

    var callSheetId = params.get('callSheetId');
    this.subscribe('veteranCallSheet', callSheetId, () => {
      this.veteranCallSheet = VeteranCallSheets.findOne(callSheetId);
    }, true);

/*    this.subscribe('userProfiles', () => {
      this.users = UserProfiles.find( { $and: [ { isRemoved: false }, { isValidated: true } ] } ).fetch();      
      this.user = UserProfiles.findOne( { userId: Meteor.userId() } );
    }, true);
*/
    var fb = new FormBuilder();
    this.veteranCallSheetForm = fb.group({
      data: [''],
      requestedGuardian: ['']
    });
  }

}
