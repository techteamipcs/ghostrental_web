import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PageService } from '../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  url: any;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
  ) {
  }
  ngOnInit() {
    this.get_PageMeta();
    if (isPlatformBrowser(this.platformId)) {
      this.url = this.router.url;
      if(this.url.includes('Location')){
        let waUrl = 'https://maps.app.goo.gl/2AxX5kQzyzKzHCc26';
        window.location.href = waUrl;
      } else if(this.url.includes('Review')){
        let waUrl = 'https://g.page/r/CYLV9IPjYTZLEBM/review';
        window.location.href = waUrl;
      } else if(this.url.includes('Instagram')){
        let waUrl = 'https://www.instagram.com/ghost.rentals/?hl=en';
        window.location.href = waUrl;
      } else if(this.url.includes('Facebook')){
        let waUrl = 'https://www.facebook.com/Ghostrentalsdubai';
        window.location.href = waUrl;
      } else if(this.url.includes('Tiktok')){
        let waUrl = 'https://www.tiktok.com/@ghostrentals';
        window.location.href = waUrl;
      } else if(this.url.includes('Linkedin')){
        let waUrl = 'https://ae.linkedin.com/company/ghostrentals';
        window.location.href = waUrl;
      } else if(this.url.includes('YouTube')){
        let waUrl = 'https://www.youtube.com/@GhostRentalsDXB?app=desktop';
        window.location.href = waUrl;
      } else if(this.url.includes('ViewYachts')){
        let waUrl = 'https://www.ghostrentals.ae/product/search?type=Yachts';
        window.location.href = waUrl;
      } else if(this.url.includes('ViewCars')){
        let waUrl = 'https://www.ghostrentals.ae/product/search?type=Car';
        window.location.href = waUrl;
      }
    }
  }

   get_PageMeta() {
    let obj = { pageName: 'home' };
    this.pageservice.getpageWithName(obj).subscribe((response) => {
      if (response.body.code == 200) {
        this.titleService.setTitle(response?.body.result.meta_title);
        this.metaTagService.updateTag({
          name: 'description',
          content: response?.body.result.meta_description,
        });
        this.metaTagService.updateTag({
          name: 'keywords',
          content: response?.body.result.meta_keywords,
        });
      } else if (response.code == 400) {
      } else {
      }
    });
  }
}
