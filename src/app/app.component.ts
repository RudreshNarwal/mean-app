import { Component } from '@angular/core';

import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) { }

// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.authService.autoAuthUser();
  }
}
