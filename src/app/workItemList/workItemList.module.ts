import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LargeQueryWarning } from './components/home/home.component';
import { AreaPathsComponent } from './components/areaPaths/areaPaths.component';
import { IterationPathsComponent } from './components/iterationPaths/iterationPaths.component';
import { routes } from './workItemList.routing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import {
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule
} from '@angular/material';

import { AreaPathsService } from './services/areaPaths.service';
import { IterationPathsService } from './services/iterationPaths.service';

@NgModule({
  imports: [
    CommonModule,
    routes,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  entryComponents: [LargeQueryWarning],
  declarations: [HomeComponent, LargeQueryWarning, AreaPathsComponent, IterationPathsComponent],
  providers: [AreaPathsService, IterationPathsService],
  exports: [LargeQueryWarning]
})
export class WorkItemListModule { }
