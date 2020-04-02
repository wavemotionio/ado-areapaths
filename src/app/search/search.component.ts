import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import _ from 'lodash';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormNavigationService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { WhitespaceValidator } from '../shared/whitespace.validator';

interface AreaPathNode {
  name: string;
  children?: AreaPathNode[];
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {

    myControl = new FormControl('', [Validators.required, WhitespaceValidator.notEmpty]);
    options: string[];
    filteredOptions: Observable<string[]>;
    flattenedArr = [];

    areaPathsAndIterations: any;
    isLoading: boolean;
    treeControl = new NestedTreeControl<AreaPathNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<AreaPathNode>();

    constructor(private searchService: SearchService) {}

    hasChild = (_: number, node: AreaPathNode) => !!node.children && node.children.length > 0;

    async ngOnInit() {
        await SDK.ready();

        this.searchService.getAreaPaths().then(data => {
            let test = _.get(data, 'areaPaths.children');
            
            this._flatten(test);

            this.options = this.flattenedArr;

            this.dataSource.data = test || [];
        });

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );

        this.searchService.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _flatten(arr) {
        _.each(arr, (item) => {
            this.flattenedArr.push(item['path']);

            if (item.children && item.children.length > 0) {
                this._flatten(item.children);
            }
        });
    }

    async addNewWorkItem(areaPath) {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);

        navSvc.openNewWorkItem('Product Backlog Item', {
            priority: 4,
            "System.AreaPath": areaPath,
            "System.AssignedTo": SDK.getUser().name,
            "System.Description": 'As ___, we require that ___ so that ___.',
            "Microsoft.VSTS.Common.AcceptanceCriteria": "___ must ___.",
            "Microsoft.VSTS.Common.BusinessValue": 5,
            "Microsoft.VSTS.Common.ValueArea": 'Architectural'
         });
    }

    getErrorMessage() {
        return this.myControl.hasError('required') || this.myControl.hasError('notEmpty') ? 'You must enter a valid path.' : '';
    }
}
