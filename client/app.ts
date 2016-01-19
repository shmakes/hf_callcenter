/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone, provide, enableProdMode} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {bootstrap} from 'angular2-meteor';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';
import {CallCentersList} from 'client/call_centers-list/call_centers-list';
import {CallCenterDetails} from 'client/call_center-details/call_center-details';
import {CallPacketsList} from 'client/call_packets-list/call_packets-list';
import {UserProfileDetails} from 'client/user_profile-details/user_profile-details';

@Component({
    selector: 'app'
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', as: 'CallCentersList', component: CallCentersList },
    { path: '/call_center/:callCenterId', as: 'CallPacketsList', component: CallPacketsList },
    { path: '/call_center/edit/:callCenterId', as: 'CallCenterDetails', component: CallCenterDetails },
    { path: '/user_profile/:userProfileId', as: 'UserProfileDetails', component: UserProfileDetails }
])

class HFCallCenter {} 

//enableProdMode();
bootstrap(HFCallCenter, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
