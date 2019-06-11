import _ from 'lodash';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, getClient, IProjectPageService } from "azure-devops-extension-api";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";

@Injectable()
export class IterationPathsService {
    private isLoadingData = new BehaviorSubject(false);

    isLoadingPage = this.isLoadingData.asObservable();

    constructor() { }

    async getIterationPaths(): Promise<any> {
        this.isLoadingData.next(true);

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService),
            project = await projectService.getProject(),
            client = getClient(WorkItemTrackingRestClient),
            fullAreaPathObjects = await client.getClassificationNodes(project.name, null, 10),
            mapChildren = (childrenItems) => (_.map(childrenItems, (childItem) => {
                return {
                    name: childItem.name,
                    path: childItem.path.replace('\\Area\\', '\\').replace('\\Iteration\\', '\\').replace(`\\${project.name}`, project.name),
                    children: childItem.hasChildren ? mapChildren(childItem.children) : null

                }
            })),
            removedCruft = _.map(fullAreaPathObjects, (areaPathObject) => (
                {
                    name: areaPathObject.name,
                    path: areaPathObject.path,
                    children: mapChildren(areaPathObject.children)
                }
            )),
            iterationsAndAreaPaths = _.partition(removedCruft, (iterationsAndAreas) => (
                _.includes(iterationsAndAreas.path, '\\Area')
            ));

        iterationsAndAreaPaths[0][0].path = iterationsAndAreaPaths[0][0].path.replace(`\\${project.name}\\Area`, project.name);
        iterationsAndAreaPaths[1][0].path = iterationsAndAreaPaths[1][0].path.replace(`\\${project.name}\\Iteration`, project.name);

        let test = {
            areaPaths: iterationsAndAreaPaths[0][0],
            iterations: iterationsAndAreaPaths[1][0]
        };

        this.isLoadingData.next(false);

        return test;
    }
}
