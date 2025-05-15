import { Component } from '@angular/core';
import { AppStateService } from '../core/services/app-state/app.state.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent {
  public authenticated = true;
  public isMiniSidebar = false;
  public expandMenu: boolean | string = false;
  public isProcessing = false;

  constructor(private appStateService: AppStateService) {
    this.appStateService.isLoggedIn().subscribe(res => {
      this.authenticated = res;
    });

    this.appStateService.isMiniSidebar().subscribe(res => {
      this.isMiniSidebar = res;
    });

    this.appStateService.isProcessing().subscribe(res => {
      setTimeout(() => {
        this.isProcessing = res;
      }, 0);
    });
  }
}
