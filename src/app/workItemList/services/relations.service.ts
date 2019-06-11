import {Injectable, Inject} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import _ from 'lodash';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class RelationsService {
    private relationsDataSource = new BehaviorSubject({});
    private successorsDataSource = new BehaviorSubject({});

    private isLoadingData = new BehaviorSubject(false);

    relationsData = this.relationsDataSource.asObservable();
    successorsData = this.successorsDataSource.asObservable();

    isLoadingPage = this.isLoadingData.asObservable();
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    constructor(private httpClient: HttpClient) { }

    getChildRelations(workItemId): any {
        this.isLoadingData.next(true);
        this.httpClient.get(`${this.config.apiEndpoint}/workItems/children/${workItemId}`, { headers: this.headers }).pipe(map((data) => (
            data
        ))).subscribe(data => {
            this.isLoadingData.next(false);
            this.relationsDataSource.next(data);
        });
    }

    getSuccessors(workItemId): any {
        this.isLoadingData.next(true);
        this.httpClient.get(`${this.config.apiEndpoint}/workItems/successors/${workItemId}`, { headers: this.headers }).pipe(map((data) => (
            data
        ))).subscribe(data => {
            this.isLoadingData.next(false);
            this.successorsDataSource.next(data);
        });
    }
}
