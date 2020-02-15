import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AreaPathsComponent } from './components/areaPaths/areaPaths.component';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaPathsService } from './services/areaPaths.service';

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
    MatFormFieldModule,
    MatInputModule,
    MatTreeModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  declarations: [HomeComponent, AreaPathsComponent],
  providers: [AreaPathsService]
})
export class WorkItemListModule { }
