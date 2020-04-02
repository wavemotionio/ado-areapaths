import {Component, Injectable, OnInit} from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import {BehaviorSubject, Observable, merge } from 'rxjs';
import {map} from 'rxjs/operators';
import _ from 'lodash';
import { RootDataSourceService } from "../shared/services/rootDataSource.service";
import { ActivatedRoute } from '@angular/router';
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { WorkItemTrackingRestClient, IWorkItemFormNavigationService, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatWorkItems } from './formatWorkItems';

export class DynamicFlatNode {
  constructor(public item: any, public level: number = 1, public expandable: boolean = false, public isLoading: boolean = false, public children: any = []) {}
}

@Injectable()
export class DynamicDatabase {
    private originalDataSource = new BehaviorSubject({});
    private isLoadingData = new BehaviorSubject(false);
    private warning = {
        message: 'Wait! This query includes over 1000 results. Go back and try a smaller query.',
        subject: 'Warning'
    };

    currentData = this.originalDataSource.asObservable();
    isLoadingPage = this.isLoadingData.asObservable();

    constructor(private _snackBar: MatSnackBar) { }

    async filter(filterText: string, unfilteredData: any): Promise<void> {
        this.originalDataSource.next(_.filter(unfilteredData, (treenode)=> {
            return _.includes(_.get(treenode, 'item.title').toLowerCase(), filterText.toLowerCase()) ||
                _.includes(_.get(treenode, 'item.id').toString(), filterText.toLowerCase());
        }));
    }

    async setCustomWIQLQuery(query: string): Promise<void> {
        this.isLoadingData.next(true);

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService),
            project = await projectService.getProject(),
            client = getClient(WorkItemTrackingRestClient),
            queryResults = await client.queryByWiql({query}),
            wiIds = _.map(queryResults.workItems, workItem => (workItem.id)),
            chunks = _.chunk(wiIds, 199);

        let allWorkItems = [];

        if (wiIds.length > 1000) {
            this._snackBar.open(`${this.warning.message} (total: ${wiIds.length})`, this.warning.subject, {
              duration: 10000,
              verticalPosition: 'top'
            });
        }

        for(let i=0; i<chunks.length; i++) {
            const postRequest = {
                $expand: 4,
                asOf: null,
                errorPolicy: 2,
                fields: null,
                ids: chunks[i] || []
            },
            workItemsList = postRequest.ids.length > 0 ? await client.getWorkItemsBatch(postRequest, project.name) : [],
            workItemsListFormatted = formatWorkItems(workItemsList);

            allWorkItems = _.concat(allWorkItems, workItemsListFormatted);
        }

        let findAllChildIds = _.uniq(_.flatten(_.map(allWorkItems, (workItem) => {
            return workItem.children;
        })));

        const result = _.reject(_.map(allWorkItems, workItem => (
            new DynamicFlatNode(workItem.item, 0, !_.isEmpty(workItem.children), false, workItem.children)
        )), row => (_.includes(findAllChildIds, row.item.id)));

        this.isLoadingData.next(false);
        this.originalDataSource.next(result);
    }

    async getDynamicChildren(node: any): Promise<any> {
        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService),
            project = await projectService.getProject(),
            client = getClient(WorkItemTrackingRestClient),
            chunks = _.chunk(node.children, 199);
        let allWorkItems = [];

        if (node.children.length > 1000) {
            this._snackBar.open(`${this.warning.message} (total: ${node.children.length})`, this.warning.subject, {
                duration: 10000,
                verticalPosition: 'top'
            });
        }

        for(let i=0; i<chunks.length; i++) {
            const childWorkItems = {
                    $expand: 4,
                    asOf: null,
                    errorPolicy: 2,
                    fields: null,
                    ids: chunks[i] || []
                },
                getChildrenDetails = await client.getWorkItemsBatch(childWorkItems, project.name),
                formattedChildDetails = formatWorkItems(getChildrenDetails);

            allWorkItems = _.concat(allWorkItems, formattedChildDetails);
        }

        return allWorkItems;
    }

    isExpandable(node: any): boolean {
        return _.get(node, 'length') && node.length > 0;
    }
}

@Injectable()
export class DynamicDataSource {

    dataChange: BehaviorSubject<DynamicFlatNode[]> = new BehaviorSubject<DynamicFlatNode[]>([]);

    get data(): DynamicFlatNode[] { return this.dataChange.value; }
    set data(value: DynamicFlatNode[]) {
        this.treeControl.dataNodes = value;
        this.dataChange.next(value);
    }

    constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
              private database: DynamicDatabase) {}

    connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
        this.treeControl.expansionModel.changed!.subscribe(change => {
            if ((change as SelectionChange<DynamicFlatNode>).added ||
                (change as SelectionChange<DynamicFlatNode>).removed) {
                this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
            }
        });

        return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
    }

    handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
        if (change.added) {
            change.added.forEach((node) => this.toggleNode(node, true));
        }
        if (change.removed) {
            change.removed.reverse().forEach((node) => this.toggleNode(node, false));
        }
    }

    toggleNode(node: DynamicFlatNode, expand: boolean) {
        const index = this.data.indexOf(node);

        if (!node || !node.children || node.children.length < 1) {
            return;
        }

        if (expand) {
            node.isLoading = true;

            this.database.getDynamicChildren(node).then(response => {
                this.dataChange.next(_.reject(this.data, (row) => {
                    return _.includes(node.children, row.item.id);
                }));

                const nodes = _.map(response, (childNode) => {
                    return new DynamicFlatNode(childNode.item, node.level + 1, this.database.isExpandable(childNode.children), false, childNode.children);
                });

                this.data.splice(index + 1, 0, ...nodes);

                this.dataChange.next(_.uniqWith(this.data, _.isEqual));

                node.isLoading = false;
            });

        } else {
            this.data.splice(index + 1, node.children.length);
            this.dataChange.next(this.data);
        }
    }
}

@Component({
  selector: 'app-backlog',
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.css']
})

export class BacklogComponent implements OnInit {
    initialData: any;
    workItemStatesList: any = {};
    message:string;

    constructor(private database: DynamicDatabase, private rootDataSourceService: RootDataSourceService, private _Activatedroute: ActivatedRoute) {
        this.workItemStatesList['New'] = 'fiber_new';
        this.workItemStatesList['Ready for review'] = 'fiber_new';
        this.workItemStatesList['Under Review'] = 'fiber_new';
        this.workItemStatesList['Needs Design'] = 'fiber_new';
        this.workItemStatesList['Reviewed'] = 'fiber_new';
        this.workItemStatesList['To Do'] = 'fiber_new';

        this.workItemStatesList['Approved'] = 'thumb_up';

        this.workItemStatesList['In Progress'] = 'trending_up';
        this.workItemStatesList['Committed'] = 'trending_up';
        this.workItemStatesList['Development Complete'] = 'trending_up';
        this.workItemStatesList['Validated in Lab'] = 'trending_up';
        this.workItemStatesList['Validated in QA'] = 'trending_up';
        this.workItemStatesList['Deployed to QA'] = 'trending_up';
        this.workItemStatesList['QA Complete'] = 'trending_up';

        this.workItemStatesList['Failed'] = 'bug_report';

        this.workItemStatesList['Exception'] = 'cached';

        this.workItemStatesList['Done'] = 'done';

        this.workItemStatesList['Removed'] = 'delete_forever';

        this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new DynamicDataSource(this.treeControl, database);

        this.dataSource.data = [];
    }

    async ngOnInit() {
        let azurePath = this._Activatedroute.snapshot.params['azurepath'],
            pathType = this._Activatedroute.snapshot.params['pathtype'];

        this.rootDataSourceService.currentMessage.subscribe(message => this.message = message);

        if (_.isString(azurePath)) {
            this.rootDataSourceService.changeMessage('Path: ' + azurePath);
        }

        await SDK.ready();

        this.database.currentData.subscribe(data => {
            this.dataSource.data = _.reject(data, (flattenedNode) => {
                return _.isUndefined(flattenedNode.item);
            });
        });
        this.database.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);

        if (_.isString(azurePath)) {
            this.setAreaPathData(azurePath, pathType);
        }
    }

    isLoading: boolean = false;

    treeControl: FlatTreeControl<DynamicFlatNode>;

    dataSource: DynamicDataSource;

    getLevel = (node: DynamicFlatNode) => { return node.level; };

    isExpandable = (node: DynamicFlatNode) => { return node.expandable; };

    hasChild = (_: number, _nodeData: DynamicFlatNode) => { return _nodeData.expandable; };

    setAreaPathData(azurePath, pathType) {
        let systemPathType = 'AreaPath';

        if (pathType === 'iteration') {
            systemPathType = 'IterationPath';
        }

        this.database.setCustomWIQLQuery(`SELECT [System.Id] FROM WorkItems WHERE [System.${systemPathType}] UNDER '${azurePath}' AND ( [System.WorkItemType] = 'Epic' OR [System.WorkItemType] = 'Feature' OR [System.WorkItemType] = 'Product Backlog Item' OR [System.WorkItemType] = 'Bug' ) AND [System.State] NOT CONTAINS 'Done' AND [System.State] NOT CONTAINS 'Removed' ORDER BY [System.AreaPath] ASC, [System.WorkItemType] ASC, [Microsoft.VSTS.Common.Priority] ASC`);
    }

    filterChanged(filterText: string) {
        this.database.filter(filterText, this.dataSource.data);
    }

    async onNavigate(id) {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(id));
    };
}
