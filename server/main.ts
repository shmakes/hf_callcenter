import 'collections/call_centers';
import {loadCallCenters} from './load_call_centers';

Meteor.startup(loadCallCenters);