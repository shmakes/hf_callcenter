/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/user_role.d.ts" />
 
export var UserRoles = new Mongo.Collection<UserRole>('user_roles');

UserRoles.allow({
  insert: function(userRole: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(userRole: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(userRole: Object) {
    var user = Meteor.user();
    return !!user;
  }
});
