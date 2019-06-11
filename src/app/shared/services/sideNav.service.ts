import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()

export class SideNavService {

    private sideNavOpened = new BehaviorSubject(true);

    isSideNavOpened = this.sideNavOpened.asObservable();

    constructor() { }

    toggleSideNav(isOpen: boolean) {
        this.sideNavOpened.next(isOpen);
    }
}
