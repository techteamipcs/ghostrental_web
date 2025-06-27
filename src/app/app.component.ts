import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ghost-rental';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

    ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        once: false,
        mirror: true,
        easing: 'ease',
      });
    }
  }
}
