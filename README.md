[![Build Status](https://travis-ci.org/wavemotionio/ado-areapaths.svg?branch=master)](https://travis-ci.org/wavemotionio/ado-areapaths)
[![Greenkeeper badge](https://badges.greenkeeper.io/wavemotionio/ado-areapaths.svg)](https://greenkeeper.io/)
![David](https://img.shields.io/david/wavemotionio/ado-areapaths.svg)
![David](https://img.shields.io/david/dev/wavemotionio/ado-areapaths.svg)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/wavemotionio/ado-areapaths.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/wavemotionio/ado-areapaths/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/wavemotionio/ado-areapaths.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/wavemotionio/ado-areapaths/alerts/)
[![Known Vulnerabilities](https://snyk.io/test/github/wavemotionio/ado-areapaths/badge.svg?targetFile=package.json)](https://snyk.io/test/github/wavemotionio/ado-areapaths?targetFile=package.json)
[![Maintainability](https://api.codeclimate.com/v1/badges/d9e4684f0c9e34dda434/maintainability)](https://codeclimate.com/github/wavemotionio/ado-areapaths/maintainability)
[![Inline docs](http://inch-ci.org/github/wavemotionio/ado-areapaths.svg?branch=master)](http://inch-ci.org/github/wavemotionio/ado-areapaths)

# ado-areapaths ![GitHub package.json version](https://img.shields.io/github/package-json/v/wavemotionio/ado-areapaths.svg)

## Why? [![start with why](https://img.shields.io/badge/start%20with-why%3F-brightgreen.svg?style=flat)](https://github.com/wavemotionio/ado-areapaths/issues)
So that you can search and view area paths of Azure DevOps without creating and maintaining custom queries. Once enabled, the `AreaPaths` hub will appear within the `Boards` hub of Azure DevOps. *The feature flag defaults to true but can be toggled off.*

## Install from Visual Studio Marketplace
https://marketplace.visualstudio.com/items?itemName=wavemotionio.ado-areapaths

## How to use

#### Navigate to the Area Path search in the azure devops boards hub:
![alt text](https://github.com/wavemotionio/ado-areapaths/raw/master/docs/1-area-paths-in-boards-hub.png "Navigate to the Area Path search.")

#### Select an Area Path in the search field:
![alt text](https://github.com/wavemotionio/ado-areapaths/raw/master/docs/2-area-paths-search.png "Select an Area Path.")

#### View Area Path, expand work items with children, then filter by keyword or ID to narrow down results:
![alt text](https://github.com/wavemotionio/ado-areapaths/raw/master/docs/3-area-path-viewer-and-filter.png "View, expand children, then filter.")

### References
- https://docs.microsoft.com/en-us/azure/devops/extend/get-started/node?view=azure-devops
- https://github.com/microsoft/vss-web-extension-sdk
- https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/controls/combo?view=azure-devops
- https://wavemotionio.visualstudio.com/ado-tools/_apps/hub/wavemotionio.ado-areapaths.ado-areapaths
- https://wavemotionio.gallery.vsassets.io/app/areaPaths
- https://marketplace.visualstudio.com/manage/publishers/wavemotionio?src=wavemotionio.ado-areapaths
- https://docs.microsoft.com/en-us/azure/devops/extend/develop/auth?view=azure-devops
- https://www.npmjs.com/package/vss-web-extension-sdk
- https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=azure-devops
- https://github.com/microsoft/azure-devops-extension-api
- https://github.com/microsoft/azure-devops-extension-sample

# Development Notes

## To Dos
1. Update to support other projects types other than SCRUM (additional work item types)
1. Add iterations option
2. Update devDeps
```
Update devDependencies
"eslint": "*",
"karma": "*",
"karma-chrome-launcher": "*",
"karma-coverage-istanbul-reporter": "*",
"karma-jasmine": "*",
"karma-jasmine-html-reporter": "*",
"protractor": "*",
"ts-node": "*",
```



import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";
import * as _ from "lodash";
import "./AreaPaths.scss";

import { Button } from "azure-devops-ui/Button";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Header } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";

import { showRootComponent } from "../Common";


class AreaPathsContent extends React.Component<{}, {}> {

    private workItemIdValue = new ObservableValue("1");
    private workItemTypeValue = new ObservableValue("Bug");
    private selection = new ListSelection();
    private workItemTypes = new ObservableArray<IListBoxItem<string>>();
    private workItems = new ObservableArray<any>();

    constructor(props: {}) {
        super(props);
    }

    public componentDidMount() {
        SDK.init();
        this.loadWorkItemTypes();
        this.loadCommittedWithNoTasks();
    }

    public render(): JSX.Element {
        return (
            <Page className="sample-hub flex-grow">
                <Header title="Work Item Open Sample" />
                <div className="page-content">
                    <div className="sample-form-section flex-row flex-center">
                        <TextField className="sample-work-item-id-input" label="Existing work item id" value={this.workItemIdValue} onChange={(ev, newValue) => { this.workItemIdValue.value = newValue; }} />
                        <Button className="sample-work-item-button" text="Open..." onClick={() => this.onOpenExistingWorkItemClick()} />
                    </div>
                    <div className="sample-form-section flex-row flex-center">
                        <div className="flex-column">
                            <label htmlFor="work-item-type-picker">New work item type:</label>
                            <Dropdown<string>
                                className="sample-work-item-type-picker"
                                items={this.workItemTypes}
                                onSelect={(event, item) => { this.workItemTypeValue.value = item.data! }}
                                selection={this.selection}
                            />
                        </div>
                        <Button className="sample-work-item-button" text="New..." onClick={() => this.onOpenNewWorkItemClick()} />
                    </div>
                </div>
            </Page>
        );
    }

    private async loadWorkItemTypes(): Promise<void> {

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        let workItemTypeNames: string[];

        if (!project) {
            workItemTypeNames = [ "Issue" ];
        }
        else {
            const client = getClient(WorkItemTrackingRestClient);
            const types = await client.getWorkItemTypes(project.name);
            workItemTypeNames = types.map(t => t.name);
            workItemTypeNames.sort((a, b) => localeIgnoreCaseComparer(a, b));
        }

        this.workItemTypes.push(...workItemTypeNames.map(t => { return { id: t, data: t, text: t } }));
        this.selection.select(0);
    }

    private async hydrateChildren(unpopulatedChildren: any, client: any, project: any): Promise<any> {
        return new Promise(async resolve => {
            let workItemsWithChildren = _.cloneDeep(unpopulatedChildren);

            for (let i=0; i < workItemsWithChildren.length; i++) {

                let populatedRelations = [];

                for (let x=0; x < workItemsWithChildren[i]['relations'].length; x++) {

                    let wiDetails = await client.getWorkItem(parseInt(workItemsWithChildren[i]['relations'][x]), project.name, [
                        'System.WorkItemType',
                        'System.State'
                    ], undefined, 0);

                    populatedRelations.push(wiDetails);

                }

                workItemsWithChildren[i]['relations'] = populatedRelations;
            }

            resolve(workItemsWithChildren);
        });
    }

    private async loadCommittedWithNoTasks(): Promise<void> {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        let workItemsTemp: any[];

        if (!project) {
            workItemsTemp = [];
        }
        else {
            const client = getClient(WorkItemTrackingRestClient);

            //replace with another method of aggregating work items
            let hydratedWorkItems = await client.getWorkItems([1,2,3,4,5,6,7,8,9,10,11,12], project.name, undefined, undefined, 1);

            let workItemsWithChildren = _
                .chain(hydratedWorkItems)
                .reject((workitem: any) => workitem.fields['System.WorkItemType'] !== 'Product Backlog Item' || workitem.fields['System.State'] !== 'Committed')
                .map((workitem: any) => {
                    workitem.relations = _
                        .chain(workitem.relations)
                        .filter((relation: any) => relation.rel === 'System.LinkTypes.Hierarchy-Forward')
                        .map((child: any) => _.last(child.url.split('/')))
                        .value();

                    return workitem;
                })
                .value();

            let workItemsWithNoChildTasksActive = _.reject(await this.hydrateChildren(workItemsWithChildren, client, project), (parentWorkItem: any) =>
                _.find(parentWorkItem.relations, (childItem: any) =>
                    childItem.fields['System.WorkItemType'] === 'Task' &&
                        (childItem.fields['System.State'] === 'To Do' || childItem.fields['System.State'] === 'In Progress')
                )
            );

            console.log('output: ', workItemsWithNoChildTasksActive);
        }

        // workItemsTemp.forEach((item) => {
        //     console.log('new item: ' + JSON.stringify(item));
        // });

        // Find "relations" where item.rel === 'System.LinkTypes.Hierarchy-Forward'
        // get ID with _.last(item.url.split('/'))
        // get details with ID where
            // fields.System.WorkItemType === 'Task'
            // fields.System.State === 'To Do' || 'In Progress'

        // https://dev.azure.com/wavemotionio/ado-tools/_apis/wit/workitems?ids=3,4,7&$expand=relations&api-version=5.1
        // getWorkItems(ids: number[], project?: string, fields?: string[], asOf?: Date, expand?: WorkItemExpand, errorPolicy?: WorkItemErrorPolicy)


    }

    private async onOpenExistingWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(this.workItemIdValue.value));
    };

    private async onOpenNewWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(this.workItemTypeValue.value, { 
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
         });
    };
}

showRootComponent(<AreaPathsContent />);