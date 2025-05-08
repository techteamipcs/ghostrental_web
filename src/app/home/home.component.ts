import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DataService } from '../providers/data/data.service';
import { environment } from '../../environments/environment';
import { CategoryService } from '../providers/category/category.service';
declare var Swiper: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  images = [
    'https://www.miniaar.com:5011/public/banner/banner-20250326100548-banner-luxury-pret.webp',
    'https://www.miniaar.com:5011/public/banner/banner-20250326100441-banner-bridal.webp',
    'https://www.miniaar.com:5011/public/banner/banner-20250326100329-banner-couture.webp',
    'https://www.miniaar.com:5011/public/banner/banner-20250326100441-banner-bridal.webp'
  ];

  bannerData: any;
  bannerRecord: any;
  shopbyData: any;
  categorycollection: any;
  imagePath: any;
  isBrowser: boolean;
  baseUrl: any;
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService
  ) {
    this.getBannerdata();
    this.isBrowser = isPlatformBrowser(this._platformId);
    this.imagePath = environment.baseUrl + '/public/';
    this.baseUrl = environment.url;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAllcategorycollections();
  }
  ngAfterViewInit(): void {
    if (this.isBrowser) {
      new Swiper('.bannerSwiper', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false
        },
        pagination: {
          el: '.banner-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.banner-button-next',
          prevEl: '.banner-button-prev'
        }
      });
      new Swiper('.trendSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: '.trend-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.trend-button-next',
          prevEl: '.trend-button-prev',
        },
      });
    }
  }
  // Your data methods remain unchanged...
  getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.bannerData = response.result;
        } else {
        }
      }
    });
  }

  getShopBydata() {
    let obj = {};
    this.dataService.getAllShopBy(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.shopbyData = response.result;
        } else {
        }
      }
    });
  }

  // get main menu option or getAllCategorycollections

  getAllcategorycollections() {
    let obj = {};
    this.categoryService.getAllCategorycollections(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.categorycollection = response.result;
        } else {
        }
      }
    })
  }
  

}
