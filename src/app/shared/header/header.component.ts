import {
  Component,
  OnInit,
  HostListener,
  Renderer2,
  Inject,
  ChangeDetectorRef,
  PLATFORM_ID
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  isScrolled = false;
  isMenuOpen: boolean = false;
  darkTextRoutes = [
    '/about',
    '/privacy',
    '/testimonials',
    '/product/search',
    '/terms',
    '/contact',
    '/product/detail',
    '/services'
  ];

  whiteTextRoutes = [
    '/',
    '/product/list',
    '/services',
    '/booking'
  ];
  isDarkText = false;
  isWhiteText = false;
  currentRoute: string = '';
  useWhiteButton = false;
  isBrowser: boolean;
  hasLargePadding = false;
  largePaddingRoutes = ['/', '/product/list', '/services', '/booking'];
  detailRouteRegex = /^\/detail\//;
  listRouteRegex = /^\/product\/list/;
  bookingRouteRegex = /^\/booking/;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Get the path without query parameters
      const path = event.url.split('?')[0];
      this.currentRoute = path;

      const shouldHaveWhiteText = this.whiteTextRoutes.some(route =>
        path === route || path.startsWith(route + '/')
      );
      const shouldHaveDarkText = this.darkTextRoutes.some(route =>
        path === route || path.startsWith(route + '/')
      );

      this.isDarkText = shouldHaveDarkText && !shouldHaveWhiteText;

      this.useWhiteButton = this.whiteTextRoutes.some(route =>
        path === route || path.startsWith(route + '/')
      );

      // Only apply large padding to routes in largePaddingRoutes array
      this.hasLargePadding = this.largePaddingRoutes.some(route => {
        // Check if current route exactly matches or starts with the route
        return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
      });

      if (this.isBrowser) {
        window.scrollTo(0, 0);
      }
      this.updateTextColor();
      this.changeDetector.detectChanges();
    });
  }

  
  ngOnInit(): void {
    const path = this.router.url.split('?')[0];
    this.currentRoute = path;

    const shouldHaveWhiteText = this.whiteTextRoutes.some(route =>
      path === route || path.startsWith(route + '/')
    );
    const shouldHaveDarkText = this.darkTextRoutes.some(route =>
      path === route || path.startsWith(route + '/')
    );

    this.isDarkText = shouldHaveDarkText && !shouldHaveWhiteText;
    this.useWhiteButton = shouldHaveWhiteText;

    const isDetailRoute = this.detailRouteRegex.test(this.currentRoute);
    const isListRoute = this.listRouteRegex.test(this.currentRoute);
    const isBookingRoute = this.bookingRouteRegex.test(this.currentRoute);

    this.hasLargePadding = this.largePaddingRoutes.some(route => this.currentRoute.includes(route)) ||
      isDetailRoute ||
      isListRoute ||
      isBookingRoute ||
      this.currentRoute === '/';

    this.updateTextColor();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isBrowser) {
      const wasScrolled = this.isScrolled;
      this.isScrolled = window.scrollY > 50;
      this.renderer[this.isScrolled ? 'addClass' : 'removeClass'](this.document.body, 'header-scrolled');
      this.updateTextColor();
      this.changeDetector.detectChanges();
    }
  }

  private updateTextColor(): void {
    const navElement = this.document.querySelector('nav');
    if (!navElement) return;

    if (this.isScrolled || this.isMenuOpen) {
      this.renderer.addClass(navElement, 'scrolled');
      this.renderer.removeClass(navElement, 'dark-text');
    } else {
      if (this.isDarkText) {
        this.renderer.addClass(navElement, 'dark-text');
        this.renderer.removeClass(navElement, 'scrolled');
      } else {
        this.renderer.removeClass(navElement, 'dark-text');
        this.renderer.removeClass(navElement, 'scrolled');
      }
    }
  }

  selectLink(route: string): void {
    this.router.navigate([route]);
  }

  aboutPage(): void {
    this.router.navigate(['/about']);
  }

  toggleMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.renderer.addClass(this.document.body, 'menu-open');
      this.renderer.addClass(this.document.documentElement, 'menu-open');
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      this.renderer.setStyle(this.document.documentElement, 'overflow', 'hidden');

      if (this.isBrowser) {
        setTimeout(() => {
          const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
          menuItems.forEach((item) => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          });
        }, 50);
      }
    } else {
      this.closeMenu();
    }

    this.changeDetector.detectChanges();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.renderer.removeClass(this.document.body, 'menu-open');
    this.renderer.removeClass(this.document.documentElement, 'menu-open');
    this.renderer.removeStyle(this.document.body, 'overflow');
    this.renderer.removeStyle(this.document.documentElement, 'overflow');

    const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
    menuItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuButton = this.document.querySelector('.navbar-toggler');
    const menu = this.document.querySelector('.mobile-menu');

    if (this.isMenuOpen &&
      !target.closest('.mobile-menu') &&
      !target.closest('.navbar-toggler')) {
      this.toggleMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.isBrowser && window.innerWidth >= 768) {
      this.isMenuOpen = false;
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
  }
}
