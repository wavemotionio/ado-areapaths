import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IExtensionDataService } from "azure-devops-extension-api";

@Injectable({
    providedIn: 'root'
})

export class SearchHistoryGuard implements CanActivate {
    constructor(private router: Router) {}
    
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let adoDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService),
            dataManager = await adoDataService.getExtensionDataManager(SDK.getExtensionContext().extensionId, SDK.getAccessToken().toString());

        let searchTypeHistory = await dataManager.getValue('adoAzurePathsSearchType', { scopeType: 'User' });

        if (!searchTypeHistory || searchTypeHistory === 'iteration') {

            console.log('guard activated, redirect to iteration');
            //return this.router.parseUrl('/notauthorized');

            return true;

        } else if (searchTypeHistory === 'area') {

            console.log('guard activated, redirect to area');

            return true;
        }
    }
}
