import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss' 
})
export class FooterComponent {
  imageURL: string = `${environment.url}/assets`;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  scrollToFAQ(event: Event): void {
    if (!this.isBrowser) return;
    
    event.preventDefault();
    
    // Navigate to home with fragment
    this.router.navigate(['/'], { fragment: 'faq' }).then(() => {
      // After navigation, scroll to the element
      const element = this.document.getElementById('faq');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
