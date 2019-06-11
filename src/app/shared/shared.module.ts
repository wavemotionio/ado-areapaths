import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SideNavService } from './services/sideNav.service';

/* "Barrel" of Http Interceptors */
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthInterceptor } from './services/auth-interceptor';

import { RootDataSourceService } from './services/rootDataSource.service';
import { DynamicDatabase } from '../workItemList/components/home/home.component'

/** Http interceptor providers in outside-in order */
// export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
// ];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [RootDataSourceService, DynamicDatabase, SideNavService]
})
export class SharedModule { }
