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

        let searchTypeHistory = await this._dataManager.getValue('adoAzurePathsSearchType', { scopeType: 'User' });

        if (next.queryParams.pathtype !== searchTypeHistory) {
            if (!searchTypeHistory || searchTypeHistory === 'area') {
                this._dataManager!.setValue<string>('adoAzurePathsSearchType', 'area', { scopeType: 'User' }).then(() => {
                    // console.log('user setting saved: ', 'area');
                });

                return this.router.parseUrl('/search?pathtype=area');
            } else if (searchTypeHistory === 'iteration') {
                this._dataManager!.setValue<string>('adoAzurePathsSearchType', 'iteration', { scopeType: 'User' }).then(() => {
                    // console.log('user setting saved: ', 'iteration');
                });

                return this.router.parseUrl('/search?pathtype=iteration');
            }
        } else {
            return true;
        }
    }
}
