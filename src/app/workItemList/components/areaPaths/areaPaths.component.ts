import { Component, OnInit } from '@angular/core';
import { AreaPathsService } from '../../services/areaPaths.service';
import _ from 'lodash';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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

    myControl = new FormControl();
    options: string[];
    filteredOptions: Observable<string[]>;
    flattenedArr = [];

    areaPathsAndIterations: any;
    isLoading: boolean;
    treeControl = new NestedTreeControl<AreaPathNode>(node => node.children);
    dataSource = new MatTreeNestedDataSource<AreaPathNode>();

    constructor(private areaPathsService: AreaPathsService) {}

    hasChild = (_: number, node: AreaPathNode) => !!node.children && node.children.length > 0;

    async ngOnInit() {
        this.areaPathsService.getAreaPaths().then(data => {
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

        this.areaPathsService.isLoadingPage.subscribe(isLoading => this.isLoading = isLoading);
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
}
