/// <reference path="../typings/angular2-meteor.d.ts" />
/// <reference path="../typings/call_center.d.ts" />

export var CallCenters = new Mongo.Collection<CallCenter>('call_centers');

CallCenters.allow({
  insert: function() {
    // * Do not allow addition - call centers are only added via a servic method.
    return false;
  },
  update: function(userId: string, doc: CallCenter, fields, modifier) {
    var userProfile = Meteor.call('currentUserProfile');
    var allowed = (userProfile && userProfile.isSystemAdmin);

    if (allowed) {
      console.log('*** Updating Call Center by: ' + userProfile.name + ' (' + userProfile.userId + ')');
      let hist = doc.history;
      if (doc.name != modifier.$set.name) {
        hist.push(<CallCenterHistory> {
          field: 'name',
          change: modifier.$set.name,
          updatedBy: userProfile.name,
          updatedAt: new Date().toISOString()
        });
      }
      if (doc.startDate != modifier.$set.startDate) {
        hist.push(<CallCenterHistory> {
          field: 'startDate',
          change: modifier.$set.startDate,
          updatedBy: userProfile.name,
          updatedAt: new Date().toISOString()
        });
      }
      if (doc.endDate != modifier.$set.endDate) {
        hist.push(<CallCenterHistory> {
          field: 'endDate',
          change: modifier.$set.endDate,
          updatedBy: userProfile.name,
          updatedAt: new Date().toISOString()
        });
      }
      doc.callers.forEach(function(entry) {
        if (modifier.$set.callers.indexOf(entry) < 0) {
          hist.push(<CallCenterHistory> {
            field: 'callers',
            change: 'Removed: ' + entry,
            updatedBy: userProfile.name,
            updatedAt: new Date().toISOString()
          });
        }
      });
      modifier.$set.callers.forEach(function(entry) {
        if (doc.callers.indexOf(entry) < 0) {
          hist.push(<CallCenterHistory> {
            field: 'callers',
            change: 'Added: ' + entry,
            updatedBy: userProfile.name,
            updatedAt: new Date().toISOString()
          });
        }
      });

      modifier.$set.history = hist;
      modifier.$set.updatedAt = new Date().toISOString();
    } else {
      console.log('*** Unauthorized attempt to update Call Center by: ' + userProfile.name + ' (' + userProfile.userId + ')');
    }
    return (allowed);
  },
  remove: function() {
    // * Do not allow removal - soft delete using isRemoved to hide.
    return false;
  }
});
