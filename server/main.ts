import 'collections/call_centers';
import {UserProfiles} from 'collections/user_profiles';
import {initData} from './init_data';
import './publishing';
import './hfdb_access';
import 'collections/methods';

declare var process: any;

Meteor.startup(function () {
  initData();
  if (process.env.COUCH_URL) {
    console.log(HTTP.get(process.env.COUCH_URL).content);
  }
});

Accounts.onCreateUser(function(options, user) {
  let name = '';
  let email = '';
  let isSystemAdmin = false;
  let isCenterAdmin = false;
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
    isSystemAdmin = true;
  }

  UserProfiles.insert( <UserProfile> {
    'userId':          user._id,
    'isSystemAdmin':   isSystemAdmin,
    'isCenterAdmin':   isCenterAdmin,
    'name':            name,
    'phone':           '',
    'email':           email,
    'createdAt':       new Date().toISOString(),
    'updatedAt':       new Date().toISOString(),
    'updatedBy':       'System Initialization',
    'isRemoved':       false
  });

  if (options.profile)
    user.profile = options.profile;
  return user;
});
