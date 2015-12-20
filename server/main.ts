import 'collections/call_centers';
import {loadCallCenters} from './load_call_centers';
import {getDbVersion} from './couchdb_connector/db_Connection';

Meteor.startup(function () {
  loadCallCenters();
  getDbVersion();
});
