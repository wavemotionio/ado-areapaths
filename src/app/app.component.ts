import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as SDK from "azure-devops-extension-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
    constructor() {}

    ngOnInit(){
        SDK.init();
    }
}
