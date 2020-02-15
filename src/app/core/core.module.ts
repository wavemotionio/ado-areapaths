import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { TerminalComponent } from './components/terminal/terminal.component';
import { HelpComponent } from './components/help/help.component';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    FlexLayoutModule,
    MatBottomSheetModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    MatTooltipModule
  ],
  entryComponents: [TerminalComponent, HelpComponent],
  declarations: [NavComponent, FooterComponent, TerminalComponent, HelpComponent],
  exports: [NavComponent, FooterComponent, RouterModule, TerminalComponent, HelpComponent],
})
export class CoreModule { }
