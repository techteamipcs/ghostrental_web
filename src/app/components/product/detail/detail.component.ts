import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from '../../../providers/data/data.service';

interface CarDetailItem {
  icon: string;
  label: string;
  value: string;
}

interface CarImage {
  src: string;
  alt: string;
  isActive: boolean;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  url_key: any;
  vehicleData: any;
  relatedVehicleData: any = [];
  interior: any = [];
  exterior: any = [];
  safety: any = [];
  comfort: any = [];
  images: CarImage[] = [];
  carDetails: CarDetailItem[] = [];
  currentIndex = 0;
  @ViewChild('stickyCard') stickyCard!: ElementRef;
  @ViewChild('stickyContainer') stickyContainer!: ElementRef;

  private stickyCardElement!: HTMLElement;
  private stickyContainerElement!: HTMLElement;
  private headerOffset = 150;
  private isSticky = false;
  private isBottomReached = false;
  private carSwiper: Swiper | null = null;
  @ViewChild('carSwiper', { static: false }) carSwiperRef!: ElementRef;
  constructor(public route: Router, public actRoute: ActivatedRoute, public dataservice: DataService) {
    this.url_key = this.actRoute.snapshot.paramMap.get('url_key');
    if (this.url_key) {
      this.getVehicleData();
    }
  }

  getVehicleData() {
    let obj = {
      url_key: this.url_key
    };
    this.dataservice.getSingleVehicleDataByUrlKey(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result[0];
          this.initializeCarDetails();
          if (this.vehicleData && this.vehicleData.feature_data && this.vehicleData.feature_data.length > 0) {
            this.vehicleData.feature_data.forEach(feature => {
              if (feature.type == "Interior") {
                this.interior.push(feature);
              } else if (feature.type == "Exterior") {
                this.exterior.push(feature);
              } else if (feature.type == "Safety") {
                this.safety.push(feature);
              } else if (feature.type == "Comfort & Convenience") {
                this.comfort.push(feature);
              }
            });
          }
        } else {
          this.vehicleData = null;
        }
      }
    });
  }

  carsCollections = [
    {
      name: 'BMW M3',
      image: 'home/collection/cars/bmw_m3.png',
      type: 'Sedan',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '250 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 3000,
        discounted: 2500
      }
    },
    {
      name: 'Jeep Wrangler',
      image: 'home/collection/cars/jeep_wrath.png',
      type: 'SUV',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '200 km/hr',
      class: 'Adventure',
      seat: '5',
      price: {
        regular: 2800,
        discounted: 2300
      }
    },
    {
      name: 'Lamborghini Huracan',
      image: 'home/collection/cars/lamborghini_huracan.png',
      type: 'Sports',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '320 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 5000,
        discounted: 4500
      }
    },
    {
      name: 'Rolls Royce Wraith',
      image: 'home/collection/cars/rolls_royce_wraith.png',
      type: 'Luxury Sedan',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '250 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 6000,
        discounted: 5500
      }
    },
    {
      name: 'Mclaren',
      image: 'home/collection/cars/mclaren.png',
      type: 'Sports',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '280 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 4500,
        discounted: 4000
      }
    },
    {
      name: 'Mclaren',
      image: 'home/collection/cars/mclaren.png',
      type: 'Sports',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '280 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 4500,
        discounted: 4000
      }
    },
    {
      name: 'Mclaren',
      image: 'home/collection/cars/mclaren.png',
      type: 'Sports',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '280 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 4500,
        discounted: 4000
      }
    },
    {
      name: 'Mclaren',
      image: 'home/collection/cars/mclaren.png',
      type: 'Sports',
      transmission: 'Automatic',
      fuel: 'Petrol',
      speed: '280 km/hr',
      class: 'Luxury',
      seat: '5',
      price: {
        regular: 4500,
        discounted: 4000
      }
    }
  ];

  get ourCarCollections() {
    return [...this.carsCollections];
  }

  ngOnInit() {
    // this.initializeImages();
  }

  ngAfterViewInit() {
    this.stickyCardElement = this.stickyCard.nativeElement;
    this.stickyContainerElement = this.stickyContainer.nativeElement;
    this.checkSticky();
    this.initCarSwiper();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.checkSticky();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkSticky();
  }

  private checkSticky() {
    if (!this.stickyCardElement || !this.stickyContainerElement) return;

    const containerRect = this.stickyContainerElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerBottom = containerRect.bottom + scrollTop - this.headerOffset - 20;
    const viewportHeight = window.innerHeight;
    const cardHeight = this.stickyCardElement.offsetHeight;

    const startSticky = containerRect.top + scrollTop - this.headerOffset;

    const stopSticky = containerBottom - cardHeight;
    if (scrollTop > startSticky) {
      if (scrollTop < stopSticky) {
        this.stickyCardElement.classList.add('stuck');
        this.stickyCardElement.classList.remove('bottom-reached');
        this.isSticky = true;
        this.isBottomReached = false;
      } else {
        this.stickyCardElement.classList.remove('stuck');
        this.stickyCardElement.classList.add('bottom-reached');
        this.isSticky = false;
        this.isBottomReached = true;
      }
    } else {
      this.stickyCardElement.classList.remove('stuck', 'bottom-reached');
      this.isSticky = false;
      this.isBottomReached = false;
    }
  }

  private initCarSwiper() {
    if (this.carSwiperRef?.nativeElement) {
      this.carSwiper = new Swiper(this.carSwiperRef.nativeElement, {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
          nextEl: '.car-swiper-button-next',
          prevEl: '.car-swiper-button-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        },
      });
    }
  }

  private initializeCarDetails() {
    // Single flat array of all car details
    if (this.vehicleData) {
      this.carDetails = [
        { icon: 'body', label: 'body', value: this.vehicleData.bodytype_data[0].name },
        { icon: 'mileage', label: 'mileage', value: this.vehicleData.mileage },
        { icon: 'fuel', label: 'fuel type', value: this.vehicleData.fuelType },
        { icon: 'transmission', label: 'transmission', value: this.vehicleData.transmission },
        { icon: 'engine', label: 'engine', value: this.vehicleData.engine_size },
        { icon: 'doors', label: 'doors', value: this.vehicleData.door_count },
        { icon: 'year', label: 'year', value: this.vehicleData.year },
        { icon: 'drive', label: 'drive type', value: this.vehicleData.drive_type },
        { icon: 'color', label: 'color', value: this.vehicleData.color_data[0].name }
      ];
      if (this.vehicleData.media_data && this.vehicleData.media_data.length > 0) {
        this.images.push(
          {
            src: this.backendURl+'/media/' + this.vehicleData.media_data[0].src,
            alt: this.vehicleData.media_data[0].name,
            isActive: false
          });
      }
      if (this.vehicleData.gallery_image && this.vehicleData.gallery_image.length > 0) {
        this.vehicleData.gallery_image.forEach(gal => {
          this.images.push(
            {
              src: this.backendURl+'/media/' + gal.src,
              alt: gal.name,
              isActive: false
            });
        });
      }
      // Set first image as active by default
      this.setActiveImageById(this.images[0]);
    }
  }

  ngOnDestroy() {
    if (this.carSwiper) {
      this.carSwiper?.destroy(true, true);
      this.carSwiper = null;
    }
  }

  initializeImages() {
    this.images = [
      {
        src: `${this.imageURL}/product-details/bmw_main.png`,
        alt: 'BMW i7 - Front View',
        isActive: false
      },
      {
        src: `${this.imageURL}/product-details/bmw_side1.png`,
        alt: 'BMW i7 - Side View 1',
        isActive: false
      },
      {
        src: `${this.imageURL}/product-details/bmw_side2.png`,
        alt: 'BMW i7 - Side View 2',
        isActive: false
      },
      {
        src: `${this.imageURL}/product-details/bmw_side3.png`,
        alt: 'BMW i7 - Rear View',
        isActive: false
      }
    ];

  }

  setActiveImageById(image: CarImage) {
    // Reset active state for all images
    this.images.forEach(img => img.isActive = false);

    // Set the clicked image as active
    const newIndex = this.images.findIndex(img => img.src === image.src);
    if (newIndex !== -1) {
      this.currentIndex = newIndex;
      this.images[newIndex].isActive = true;
    }
  }



  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.setActiveImageById(this.images[this.currentIndex]);
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.setActiveImageById(this.images[this.currentIndex]);
  }
  handleImageError(event: any, car: any) {
    event.target.src = `${this.imageURL}/product-details/car-placeholder.png`;
  }

  getCarDetailUrl(carName: string): string[] {
    const slug = carName.toLowerCase().replace(/\s+/g, '-');
    return ['/product', slug];
  }
  get mainImage() {
    return this.images[this.currentIndex] || this.images[0];
  }

  get thumbnailImages(): CarImage[] {
    const thumbnails: CarImage[] = [];
    const totalImages = this.images.length;

    for (let i = 1; i <= 3; i++) {
      const index = (this.currentIndex + i) % totalImages;
      thumbnails.push(this.images[index]);
    }

    return thumbnails;
  }
}
