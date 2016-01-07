/// <reference path="../typings/angular2-meteor.d.ts" />

import {Component, View, NgZone, provide} from 'angular2/core';
import {NgFor} from 'angular2/common';
import {bootstrap} from 'angular2-meteor';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';
import {CallCentersList} from 'client/call_centers-list/call_centers-list';
import {CallCenterDetails} from 'client/call_center-details/call_center-details';


@Component({
    selector: 'app'
})

@View({
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
    { path: '/', as: 'CallCentersList', component: CallCentersList },
    { path: '/call_center/:callCenterId', as: 'CallCenterDetails', component: CallCenterDetails }
])

class HFCallCenter {} 
 
bootstrap(HFCallCenter, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
