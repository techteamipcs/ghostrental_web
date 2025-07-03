import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit{
  title = 'ghost-rental';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init(
        {
          once:true,
        }
      );
    }
  }
}
