import { Component, OnInit } from '@angular/core';
import { IterationPathsService } from '../../services/iterationPaths.service';
import _ from 'lodash';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface IterationPathNode {
  name: string;
  children?: IterationPathNode[];
}

@Component({
    selector: 'app-home',
    templateUrl: './iterationPaths.component.html',
    styleUrls: ['./iterationPaths.component.css']
})

export class IterationPathsComponent implements OnInit {
    areaPathsAndIterations: any;
    isLoading: boolean;

    treeControl = new NestedTreeControl<IterationPathNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<IterationPathNode>();

    constructor(private iterationPathsService: IterationPathsService) {}

    hasChild = (_: number, node: IterationPathNode) => !!node.children && node.children.length > 0;

    ngOnInit() {
        this.iterationPathsService.getIterationPaths().then(data => {
            this.dataSource.data = _.get(data, 'iterations.children') || [];
        });

        this.iterationPathsService.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);
    }
}
