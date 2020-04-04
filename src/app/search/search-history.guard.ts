import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IExtensionDataManager, IExtensionDataService } from "azure-devops-extension-api";

@Injectable({
    providedIn: 'root'
})

export class SearchHistoryGuard implements CanActivate {
    private _dataManager?: IExtensionDataManager;

    constructor(private router: Router) {}
    
    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        await SDK.ready();
        const accessToken = await SDK.getAccessToken();
        const extDataService = await SDK.getService<IExtensionDataService>(CommonServiceIds.ExtensionDataService);
        this._dataManager = await extDataService.getExtensionDataManager(SDK.getExtensionContext().id, accessToken);

        // this._dataManager!.setValue<string>('adoAzurePathsSearchType', 'area', { scopeType: 'User' }).then(() => {
        //     console.log('user setting saved: ', 'area');
        // });
        let searchTypeHistory = await this._dataManager.getValue('adoAzurePathsSearchType', { scopeType: 'User' });

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
