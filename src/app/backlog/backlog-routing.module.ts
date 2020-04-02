import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BacklogComponent } from './backlog.component';

const routes: Routes = [
		{ 
			path: '',
			component: BacklogComponent
		},
		{
	        path: ':pathtype/:azurepath',
	        component: BacklogComponent
	    }
	];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BacklogRoutingModule { }
