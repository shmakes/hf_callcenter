/// <reference path="../typings/angular2-meteor.d.ts" />
 
import {CallCenters} from 'collections/call_centers';
import {UserRoles} from 'collections/user_roles';
 
Meteor.publish('callCenters', function() {
  var role = UserRoles.findOne( { userId: this.userId } );
  var isAdmin = (!!role && role.isAdmin);
  console.log(this.userId + ' - Administrator: ' + isAdmin);
  return isAdmin
          ? CallCenters.find() 
          : CallCenters.find( { 
              $and: [ 
                      { callers: { $exists: true } } , 
                      { callers: this.userId } 
                    ] 
          } );
});

Meteor.publish('userRoles', function() {
  var role = UserRoles.findOne( { userId: this.userId } );
  var isAdmin = (!!role && role.isAdmin);
  console.log("Roles published");
  return isAdmin
          ? UserRoles.find() 
          : UserRoles.find( { userId: this.userId } );
});
