import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import * as packagejson from '../../../../../package.json';

@Component({
  selector: 'help-component',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent {
    constructor(private bottomSheetRef: MatBottomSheetRef<HelpComponent>) {
    	console.log(`version: ${packagejson.version}`);
    }

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }
}
