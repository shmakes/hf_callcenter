/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/user_profile.d.ts" />

export var UserProfiles = new Mongo.Collection<UserProfile>('user_profiles');

UserProfiles.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
