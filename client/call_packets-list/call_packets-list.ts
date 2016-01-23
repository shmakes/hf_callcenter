/// <reference path="../../typings/angular2-meteor.d.ts" />
/// <reference path="../../typings/meteor-accounts-ui.d.ts" />
/// <reference path="../../typings/meteor-accounts.d.ts" />
/// <reference path="../../typings/call_packet.d.ts" />
/// <reference path="../../typings/moment/moment.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {CallPackets} from 'collections/call_packets';
import {RouterLink, RouteParams} from 'angular2/router';
import {AccountsUI} from 'meteor-accounts-ui';
import {InjectUser} from 'meteor-accounts';
import {MeteorComponent} from 'angular2-meteor';
import {CallStatus} from 'collections/enums';
import {Utils} from 'client/utils';

@Component({
    selector: 'call_packets-list'
})

@View({
    templateUrl: '/client/call_packets-list/call_packets-list.html',
    directives: [NgFor, RouterLink, AccountsUI]
})

@InjectUser()
export class CallPacketsList extends MeteorComponent {
  assignedCallPackets: Mongo.Cursor<CallPacket>;
  availableCallPackets: Mongo.Cursor<CallPacket>;
  user: Meteor.User;
  callCenterId: string;
  callCenterName: string;
  utils: Utils;

  constructor (params: RouteParams) {
    super();
    this.utils = new Utils();
    this.callCenterId = params.get('callCenterId');

    Meteor.call('getCallCenterName', this.callCenterId, (error, response) => {
      this.callCenterName = response;
    });

    this.subscribe('assignedCallPackets', this.callCenterId, () => {
      this.assignedCallPackets = CallPackets.find( { callerId: {'$ne' : ''}} );
    }, true);

    this.subscribe('availableCallPackets', this.callCenterId, () => {
      this.availableCallPackets = CallPackets.find( { callerId: '' } );
    }, true);
  }

  callStatusName(callStat: number) {
    return CallStatus[callStat];
  }

  getCallCenterName() {
    return this.callCenterName;
  }
}
