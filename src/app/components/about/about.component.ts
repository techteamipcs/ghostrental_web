import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  imageURL: string = `${environment.url}/assets`;
  bannerData: any;
  constructor(
    private dataservice: DataService
  ) {
  }
  ngOnInit() {
    this.getBannerData();
  }

  features = [
    {
      image: 'home/cars.png',
      title: 'Elite Fleet',
      description: 'Curated collection of world-class vehicles and yachts',

    },
    {
      image: 'home/hand.png',
      title: 'White-Glove Service',
      description: 'VIP-level customer service & support',
    },
    {
      image: 'home/fullday.png',
      title: '24/7 Easy Booking',
      description: 'Seamless online booking and 24/7 availability',
    },
    {
      image: 'home/earth.png',
      title: 'UAE-Wide Coverage',
      description: 'Serving Dubai and all major UAE destinations',
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
