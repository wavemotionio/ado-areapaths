import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { RootDataSourceService } from "../../../shared/services/rootDataSource.service";
import { DynamicDatabase } from "../../../workItemList/components/home/home.component";

@Component({
  selector: 'terminal-component',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})

export class TerminalComponent implements OnInit {

    message:string;
    value: string;

    constructor(
        private bottomSheetRef: MatBottomSheetRef<TerminalComponent>,
        private rootDataSourceService: RootDataSourceService,
        private dynamicDatabase: DynamicDatabase
    ) {}

    openLink(event: MouseEvent): void {
        this.bottomSheetRef.dismiss();
        event.preventDefault();
    }

    ngOnInit() {
        this.rootDataSourceService.currentMessage.subscribe(message => this.message = message);
        this.value = `SELECT [System.Id] FROM WorkItems WHERE [System.WorkItemType] = 'Epic' ORDER BY [Microsoft.VSTS.Common.Priority] DESC`;
    }

    newMessage() {
        this.rootDataSourceService.changeMessage(this.value);
        this.dynamicDatabase.setCustomWIQLQuery(this.value);
    }
}