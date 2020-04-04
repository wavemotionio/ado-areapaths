import _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import * as SDK from "azure-devops-extension-sdk";
import { IWorkItemFormNavigationService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { CommonServiceIds, IExtensionDataService } from "azure-devops-extension-api";


import { SearchService } from './search.service';
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
    pathType: any;
    filteredOptions: Observable<string[]>;
    pathTypeChecked: boolean;

    areaPathsAndIterations: any;
    isLoading: boolean;
    treeControl = new NestedTreeControl<AreaPathNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<AreaPathNode>();

    constructor(private searchService: SearchService, private _Activatedroute: ActivatedRoute, private router: Router) {}

    hasChild = (_: number, node: AreaPathNode) => !!node.children && node.children.length > 0;

    async ngOnInit() {
        await SDK.ready();

        let adoDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService),
            dataManager = await adoDataService.getExtensionDataManager(SDK.getExtensionContext().extensionId, SDK.getAccessToken().toString());

            console.log('dataManager', dataManager);

        this._Activatedroute.queryParams
            .subscribe(async params => {
                if (!params.pathtype || params.pathtype === 'area') {
                    this.pathType = 'Area';
                    this.pathTypeChecked = false;
                    let setStorage = dataManager.setValue('adoAzurePathsSearchType', 'area', { scopeType: 'User' });
                    console.log('area: ', setStorage);
                    this.updateTypeahead('areaPaths');
                } else if (params.pathtype === 'iteration') {
                    this.pathType = 'Iteration';
                    this.pathTypeChecked = true;
                    let setStorage = dataManager.setValue('adoAzurePathsSearchType', 'iteration', { scopeType: 'User' });
                    console.log('iteration', setStorage);
                    this.updateTypeahead('iterations');
                }
            });

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );

        this.searchService.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);
    }

    updateTypeahead(pathtype) {
        this.searchService.getAreaPaths().then(data => {
            let workItems = _.get(data, `${pathtype}.children`),
                flattenedWorkItems = [];

            this.options = this._flatten(workItems, flattenedWorkItems);
            this.dataSource.data = workItems || [];
        });
    }

    pathTypeChanged(event?) {
        this.myControl.setValue('');

        if (!event.checked) {
            this.router.navigate(['/search'], { queryParams: { pathtype: 'area' } });
        } else {
            this.router.navigate(['/search'], { queryParams: { pathtype: 'iteration' } });
        }
    }

    viewBacklog(selectedPath, pathTypeChecked) {
        let goToPathType = pathTypeChecked ? 'iteration' : 'area';

        this.router.navigate([`/backlog/${goToPathType}/${selectedPath}`]);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.options.filter(option => option.toLowerCase().includes(filterValue));
    }

    private _flatten(workItems, allItems) {
        _.each(workItems, (item) => {
            allItems.push(item['path']);

            if (item.children && item.children.length > 0) {
                this._flatten(item.children, allItems);
            }
        });

        return allItems;
    }

    // async addNewWorkItem(areaPath) {
    //     const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);

    //     navSvc.openNewWorkItem('Product Backlog Item', {
    //         priority: 4,
    //         "System.AreaPath": areaPath,
    //         "System.AssignedTo": SDK.getUser().name,
    //         "System.Description": 'As ___, we require that ___ so that ___.',
    //         "Microsoft.VSTS.Common.AcceptanceCriteria": "___ must ___.",
    //         "Microsoft.VSTS.Common.BusinessValue": 5,
    //         "Microsoft.VSTS.Common.ValueArea": 'Architectural'
    //      });
    // }

    getErrorMessage() {
        return this.myControl.hasError('required') || this.myControl.hasError('notEmpty') ? 'You must enter a valid path.' : '';
    }
}
