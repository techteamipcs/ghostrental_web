import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import * as AOS from 'aos';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit, AfterViewInit {
  imageURL: string = `${environment.url}/assets`;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.fragment.pipe(first()).subscribe(fragment => {
        if (fragment) {
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);
        }
      });
    });
  }
  ngAfterViewInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   AOS.init({
    //     once: true,
    //     mirror: true,
    //     easing: 'ease',
    //   });
    // }
  }
}
