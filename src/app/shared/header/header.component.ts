import { Component, OnInit, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  isScrolled = false;
  isMenuOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void { }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  selectLink(route: string): void {
    this.router.navigate([route]);
    this.closeMenu();
  }

  isAboutPage(): boolean {
    return this.router.url === '/about';
  }
  isPrivacyPolicyPage(): boolean {
    return this.router.url === '/privacy-policy';
  }
  isTermsAndConditionsPage(): boolean {
    return this.router.url === '/terms-and-conditions';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}