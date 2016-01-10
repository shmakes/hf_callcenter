/// <reference path="../typings/user_profile.d.ts" />

import 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
import {loadCallCenters} from './load_call_centers';
import './call_centers';
import {getDbVersion} from './couchdb_connector/db_Connection';
import 'collections/methods';

Meteor.startup(function () {
  loadCallCenters();
  getDbVersion();
});

Accounts.onCreateUser(function(options, user) {
  let name = '';
  let email = '';
  let isAdmin = false;
  if (user.emails && user.emails.length > 0 && user.emails[0].address) {
    name = email = user.emails[0].address;
  }
  if (user.services && user.services.google) {
    name = user.services.google.name;
    email = user.services.google.email;
  }
  if (user.services && user.services.facebook) {
    name = user.services.facebook.name;
    email = user.services.facebook.email;
  }
  if (Meteor.users.find().count() < 1) {
    isAdmin = true;
  }

  UserProfiles.insert( <UserProfile> {
    'userId':    user._id,
    'isAdmin':   isAdmin,
    'name':      name,
    'phone':     '',
    'email':     email,
    'createdAt': new Date().toISOString(),
    'updatedAt': new Date().toISOString()
  });

  if (options.profile)
    user.profile = options.profile;
  console.log(user);
  return user;
});
