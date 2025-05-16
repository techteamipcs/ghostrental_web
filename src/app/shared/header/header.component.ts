import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';
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
  darkTextRoutes = ['/about', '/privacy', '/testimonials', '/search', '/product/Detail', '/produc t/list'];
  isDarkText = false;

  constructor(
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const wasDarkText = this.isDarkText;
      this.isDarkText = this.darkTextRoutes.some(route => event.url.includes(route));
      window.scrollTo(0, 0);
      if (wasDarkText !== this.isDarkText) {
        this.updateTextColor();
      }
    });
  }

  ngOnInit(): void {
    // Check initial route
    this.isDarkText = this.darkTextRoutes.some(route => this.router.url.includes(route));
    // Initial update of text color
    this.updateTextColor();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const wasScrolled = this.isScrolled;
    this.isScrolled = window.scrollY > 50;

    // If we're on a dark text page and scroll state changed, update the text color
    if (this.isDarkText && wasScrolled !== this.isScrolled) {
      this.updateTextColor();
    }
  }

  private updateTextColor(): void {
    // If scrolled, show white text, otherwise respect the dark text setting
    const textElements = this.document.querySelectorAll('nav .white');
    textElements.forEach(el => {
      if (this.isScrolled) {
        this.renderer.addClass(el, 'force-white');
      } else {
        this.renderer.removeClass(el, 'force-white');
      }
    });
  }

  selectLink(route: string): void {
    this.router.navigate([route]);
  }

  aboutPage(): void {
    this.router.navigate(['/about']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // Toggle body scroll when menu is open
    const body = this.document.body;
    if (this.isMenuOpen) {
      this.renderer.setStyle(body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(body, 'overflow');
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    const body = this.document.body;
    this.renderer.removeStyle(body, 'overflow');
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