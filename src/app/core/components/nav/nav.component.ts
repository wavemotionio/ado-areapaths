import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../../../shared/services/sideNav.service';

@Component({
  selector: '[app-nav]',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    isNavOpened: boolean = true;

    constructor(private sideNavService: SideNavService) { }

    ngOnInit() {
        this.sideNavService.isSideNavOpened.subscribe(isNavOpened => this.isNavOpened = isNavOpened); 
    }

    toggleSideNav() {
        this.sideNavService.toggleSideNav(!this.isNavOpened);
    }
}
