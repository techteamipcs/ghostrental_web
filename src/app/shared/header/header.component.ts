import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageURL: string = `${environment.baseUrl}/assets`;
  isScrolled = false;
  isMenuOpen: boolean = false;
  darkTextRoutes = ['/about', '/privacy', '/testimonials'];
  isDarkText = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const wasDarkText = this.isDarkText;
      this.isDarkText = this.darkTextRoutes.some(route => event.url.includes(route));
      
      // Reset scroll position when route changes
      window.scrollTo(0, 0);
      
      // If dark text state changed, update the text color
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
    const textElements = document.querySelectorAll('nav .white');
    textElements.forEach(el => {
      if (this.isScrolled) {
        el.classList.add('force-white');
      } else {
        el.classList.remove('force-white');
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
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth >= 768) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }
}