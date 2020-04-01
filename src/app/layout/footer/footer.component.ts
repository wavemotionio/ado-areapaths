import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as vssPkg from '../../../../package.json';

@Component({
  selector: '[app-footer]',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})

export class FooterComponent {

	constructor(public router: Router) { }

	extVersion = vssPkg.version;
}