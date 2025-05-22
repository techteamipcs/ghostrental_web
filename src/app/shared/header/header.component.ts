import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
  darkTextRoutes = ['/about', '/privacy', '/testimonials', '/product/search', '/product/detail', '/product/list', '/terms', '/privacy'];
  isDarkText = false;
  currentRoute: string = '';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private changeDetector: ChangeDetectorRef
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
      const wasDarkText = this.isDarkText;
      this.isDarkText = this.darkTextRoutes.some(route => this.currentRoute.includes(route));
      window.scrollTo(0, 0);
      this.updateTextColor();
      this.changeDetector.detectChanges();
    });
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.isDarkText = this.darkTextRoutes.some(route => this.currentRoute.includes(route));
    this.updateTextColor();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const wasScrolled = this.isScrolled;
    this.isScrolled = window.scrollY > 50;
    this.renderer[this.isScrolled ? 'addClass' : 'removeClass'](this.document.body, 'header-scrolled');
    this.updateTextColor();
    this.changeDetector.detectChanges();
  }

  private updateTextColor(): void {
    const navElement = this.document.querySelector('nav');
    if (!navElement) return;

    // If scrolled or menu is open, use white text
    if (this.isScrolled || this.isMenuOpen) {
      this.renderer.addClass(navElement, 'scrolled');
      this.renderer.removeClass(navElement, 'dark-text');
    } else {
      // Otherwise, respect the dark text setting based on route
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

    // Toggle body scroll and menu state
    if (this.isMenuOpen) {
      this.renderer.addClass(this.document.body, 'menu-open');
      this.renderer.addClass(this.document.documentElement, 'menu-open');
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
      this.renderer.setStyle(this.document.documentElement, 'overflow', 'hidden');

      // Animate menu items in
      setTimeout(() => {
        const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
        menuItems.forEach((item) => {
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
        });
      }, 50);
    } else {
      this.closeMenu();
    }

    // Force update the view
    this.changeDetector.detectChanges();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.renderer.removeClass(this.document.body, 'menu-open');
    this.renderer.removeClass(this.document.documentElement, 'menu-open');
    this.renderer.removeStyle(this.document.body, 'overflow');
    this.renderer.removeStyle(this.document.documentElement, 'overflow');

    // Reset menu items animation
    const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
    menuItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
    });
  }

  // Close menu when clicking outside
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
  onResize(event: any) {
    if (window.innerWidth >= 768) {
      this.isMenuOpen = false;
      const body = this.document.body;
      this.renderer.removeStyle(body, 'overflow');
    }
  }
}