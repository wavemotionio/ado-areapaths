import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'backlog', loadChildren: () => import('./backlog/backlog.module').then(m => m.BacklogModule) }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
	providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})

export class AppRoutingModule { }
