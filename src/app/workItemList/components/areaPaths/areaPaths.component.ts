import { Component, OnInit } from '@angular/core';
import { AreaPathsService } from '../../services/areaPaths.service';
import _ from 'lodash';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

interface AreaPathNode {
  name: string;
  children?: AreaPathNode[];
}

@Component({
    selector: 'app-home',
    templateUrl: './areaPaths.component.html',
    styleUrls: ['./areaPaths.component.css']
})

export class AreaPathsComponent implements OnInit {
    areaPathsAndIterations: any;
    isLoading: boolean;
    treeControl = new NestedTreeControl<AreaPathNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<AreaPathNode>();

    constructor(private areaPathsService: AreaPathsService) {}

    hasChild = (_: number, node: AreaPathNode) => !!node.children && node.children.length > 0;

    async ngOnInit() {
        this.areaPathsService.getAreaPaths().then(data => {
            this.dataSource.data = _.get(data, 'areaPaths.children') || [];
        });

        this.areaPathsService.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);
    }
}
