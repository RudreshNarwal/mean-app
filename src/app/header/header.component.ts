import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscribable, Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userIsAuthenticated = false;
private authListenerSubs: Subscription;

  constructor(private authService: AuthService) { }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
     this.userIsAuthenticated = this.authService.getIsAuth();
     this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
        });
  }

  onLogout() {
    this.authService.logout();
  }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

}
