import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchComponent } from './search.component';
import { SearchHistoryGuard } from './search-history.guard';

const routes: Routes = [
		{
	        path: '',
	        component: SearchComponent
	        // canActivate: [SearchHistoryGuard]
	    }
	];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchRoutingModule { }
