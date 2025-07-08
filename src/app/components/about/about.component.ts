import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { PageService } from '../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent  {
  imageURL: string = `${environment.url}/assets`;
  bannerData: any;
  backendURl = `${environment.baseUrl}/public`;
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
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }
  ngOnInit() {
    this.get_PageMeta();
    this.getBannerData();
  }

  get_PageMeta() {
		let obj = { pageName: 'about-us' };
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



  features = [
    {
      image: 'images/icons/cars.png',
      title: 'Premium Yachts and Cars',
      description: 'Premium Cars and Yacht Rentals Suitable for Family Use.',
    },
    {
      image: 'images/icons/hand.png',
      title: 'Family-First Service',
      description: 'Building Lasting Relationships Through Exceptional Service.',
    },
    {
      image: 'images/icons/247-black.svg',
      title: 'Booking Experience',
      description: 'Instant Booking With 24/7 Service Assistance.',
    },
    {
      image: 'images/icons/map-black.svg',
      title: 'UAE Coverage',
      description: 'Our Services Will Arrive At Your Doorstep Across Every UAE Emirate.',
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
