import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootDataSourceService } from './services/rootDataSource.service';
import { DynamicDatabase } from '../workItemList/components/home/home.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [RootDataSourceService, DynamicDatabase]
})

export class SharedModule { }
