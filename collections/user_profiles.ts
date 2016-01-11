/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />
 
export var UserProfiles = new Mongo.Collection<UserProfile>('user_profiles');

UserProfiles.allow({
  insert: function(userProfile: Object) {
    var user = Meteor.user();
    return !!user;
  },
  update: function(userProfile: Object, fields, modifier) {
    var user = Meteor.user();
    return !!user;
  },
  remove: function(userProfile: Object) {
    // * Do not allow removal - soft delete using isRemoved to hide.
    //var user = Meteor.user();
    //return !!user;
    return false;
  }
});
