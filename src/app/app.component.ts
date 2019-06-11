import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { SideNavService } from './shared/services/sideNav.service';
import * as SDK from "azure-devops-extension-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
    title = 'HPUI';
    isNavOpened: boolean = false;

    constructor(private sideNavService: SideNavService) {}

    ngOnInit(){
        SDK.init();  
        this.sideNavService.isSideNavOpened.subscribe(isNavOpened => this.isNavOpened = isNavOpened); 
    }
}
