import { BehaviorSubject } from 'rxjs';
import { CurrentUser } from './user';
import { UserPermissions } from '../api-models/permission-model';
import { getCompanyDetails } from '../api-models/company-model';

/*
Class: AppState
Purpose: Holds application state
Notes: Keep this class small, components that need access will subscribe to observables from AppState Service
*/
export class AppState {
    public isLoggedIn$: BehaviorSubject<boolean>;
    public isProcessing$: BehaviorSubject<boolean>;
    public isMiniSidebar$: BehaviorSubject<boolean>;
    public isSubscriptionActive$: BehaviorSubject<boolean>;
    public subscriptionEndsDate$: BehaviorSubject<number>;
    public getCompanySettings$: BehaviorSubject<boolean>;
    public currentUser$: BehaviorSubject<CurrentUser>;
    public currentUserPermission$: BehaviorSubject<UserPermissions>;
    public currentCompany$: BehaviorSubject<getCompanyDetails>;

    constructor() {
        this.isLoggedIn$ = new BehaviorSubject<boolean>(false);
        this.isProcessing$ = new BehaviorSubject<boolean>(false);
        this.isMiniSidebar$ = new BehaviorSubject<boolean>(false);
        this.getCompanySettings$ = new BehaviorSubject<boolean>(false);
        this.isSubscriptionActive$ = new BehaviorSubject<boolean>(true);
        this.subscriptionEndsDate$ = new BehaviorSubject<number>(0);

        const user: CurrentUser = {
            companyLogoUrl: '',
            companyName: '',
            companyRole: '',
            userName: '',
            userId:null
        };
        const company: getCompanyDetails = {};
        this.currentUser$ = new BehaviorSubject<CurrentUser>(user);
        this.currentCompany$ = new BehaviorSubject<getCompanyDetails>(company);

        const permissions = {
            userId: 0,
            permissions: {
                'dashboard': {}, 'company': {}, 'item': {}, 'service': {}, 'item group': {}, 'warehouse': {},
                'party': {}, 'bank': {}, 'sale order': {},'challan in':{},'challan out':{},'sale assets':{},'purchase assets':{}, 'sale invoice': {}, 'tax invoice': {}, 'pos invoice': {},
                'service invoice': {},'export invoice':{}, 'credit note': {}, 'purchase order': {}, 'purchase bills': {}, 'debit note': {}, 'payment in': {},
                'payment out': {}, 'journal': {}, 'expense category': {}, 'expense item': {}, 'report': {}, 'company settings': {},
            }
        };
        this.currentUserPermission$ = new BehaviorSubject<UserPermissions>(permissions);
    }
}
