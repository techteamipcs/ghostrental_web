import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent  {
  imageURL: string = `${environment.url}/assets`;
  bannerData: any;

  // Getter for background image style
  get backgroundImageStyle() {
    return {
      'background-image': `url('${this.imageURL}/about/about.png')`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
      'position': 'relative',
      'z-index': '1',
      'border-radius': '20px'
    };
  }
  constructor(
    private dataservice: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  ngOnInit() {
    this.getBannerData();
  }

  // ngAfterViewInit() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     AOS.init({
  //       once: true,
  //       mirror: true,
  //       easing: 'ease',
  //     });
  //   }
  // }


  features = [
    {
      image: 'home/cars.png',
      title: 'Premium Yachts and Cars',
      description: 'Rolls-Royce, Ferrari, Lamborghini, Yachts Suitable For Family Use.',

    },
    {
      image: 'home/hand.png',
      title: 'Family-First Service',
      description: 'Building Lasting Relationships Through Exceptional Luxury Service.',
    },
    {
      image: 'home/fullday.png',
      title: 'Perfect booking experience',
      description: '24/7 Booking Access For Instant Luxury Rental Convenience In Dubai',
    },
    {
      image: 'home/earth.png',
      title: 'Total UAE Coverage',
      description: 'Complete UAE Service Accompanied By Luxury Delivered To Your House.',
    }
  ];


  getBannerData() {
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          response.result.forEach(banner => {
            if (banner && banner.page == 'about') {
              this.bannerData = banner;
            }
          });
        }
      }
    });
  }

}
