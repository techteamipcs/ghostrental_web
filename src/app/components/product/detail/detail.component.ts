import {
  Component, OnInit, HostListener, ElementRef, ViewChild,
  AfterViewInit, OnDestroy
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../providers/data/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
  imageURL = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  url_key: any;
  vehicleData: any;
  relatedVehicleData: any[] = [];
  interior: any[] = [];
  exterior: any[] = [];
  safety: any[] = [];
  comfort: any[] = [];
  images: CarImage[] = [];
  carDetails: CarDetailItem[] = [];
  trendingRentalCars: any[] = [];
  ourCarCollections: any[] = [];
  currentIndex = 0;
  isLoading = true;

  @ViewChild('stickyCard') stickyCard!: ElementRef;
  @ViewChild('stickyContainer') stickyContainer!: ElementRef;
  @ViewChild('carSwiper', { static: false }) carSwiperRef!: ElementRef;

  private carSwiper: Swiper | null = null;
  private headerOffset = 150;
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    public actRoute: ActivatedRoute,
    public dataservice: DataService
  ) {
    this.url_key = this.actRoute.snapshot.paramMap.get('url_key');
    if (this.url_key) {
      this.getVehicleData();
    }
  }

  ngOnInit() {
    this.getCarData();
  }

  ngAfterViewInit() {
    this.checkSticky();
    setTimeout(() => this.initCarSwiper(), 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.carSwiper) {
      this.carSwiper.destroy();
      this.carSwiper = null;
    }
  }

  @HostListener('window:scroll') onWindowScroll() {
    this.checkSticky();
  }

  @HostListener('window:resize') onResize() {
    this.checkSticky();
  }

  get mainImage(): CarImage {
    return this.images[this.currentIndex] || { src: '', alt: '', isActive: false };
  }

  get thumbnailImages() {
    const maxThumbnails = 3;
    const thumbnails = [];
    const totalImages = this.images.length;

    if (totalImages > 0) {
      thumbnails.push({
        src: this.mainImage.src,
        alt: this.mainImage.alt
      });
    }

    for (let i = 1; i < maxThumbnails && i < totalImages; i++) {
      const nextIndex = (this.currentIndex + i) % totalImages;
      thumbnails.push({
        src: this.images[nextIndex].src,
        alt: this.images[nextIndex].alt,
        showCount: i === maxThumbnails - 1 && totalImages > maxThumbnails,
        count: totalImages - maxThumbnails + 1
      });
    }

    return { images: thumbnails };
  }

  private getVehicleData() {
    const obj = { url_key: this.url_key };
    this.dataservice.getSingleVehicleDataByUrlKey(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.code === 200 && response.result?.length > 0) {
          this.vehicleData = response.result[0];
          this.initializeCarDetails();
          this.sortFeatures();
        } else {
          this.vehicleData = null;
        }
      });
  }

  private getCarData() {
    const obj = {
      limit: 10,
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: 'Car'
    };
    this.dataservice.getFilterdVehicles(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe(response => {
        if (response.code === 200 && response.result?.length > 0) {
          response.result.forEach(vehicle => {
            if (vehicle.home_vehicle) this.ourCarCollections.push(vehicle);
            if (vehicle.featured_vehicle) this.trendingRentalCars.push(vehicle);
          });
        }
      });
  }

  private sortFeatures() {
    this.vehicleData.feature_data?.forEach(feature => {
      switch (feature.type) {
        case 'Interior': this.interior.push(feature); break;
        case 'Exterior': this.exterior.push(feature); break;
        case 'Safety': this.safety.push(feature); break;
        case 'Comfort & Convenience': this.comfort.push(feature); break;
      }
    });
  }

  private checkSticky() {
    if (!this.stickyCard || !this.stickyContainer) return;

    const card = this.stickyCard.nativeElement;
    const container = this.stickyContainer.nativeElement;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const containerRect = container.getBoundingClientRect();
    const containerBottom = containerRect.bottom + scrollTop - this.headerOffset - 20;
    const startSticky = containerRect.top + scrollTop - this.headerOffset;
    const stopSticky = containerBottom - card.offsetHeight;

    if (scrollTop > startSticky && scrollTop < stopSticky) {
      card.classList.add('stuck');
      card.classList.remove('bottom-reached');
    } else if (scrollTop >= stopSticky) {
      card.classList.remove('stuck');
      card.classList.add('bottom-reached');
    } else {
      card.classList.remove('stuck', 'bottom-reached');
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
          prevEl: '.car-swiper-button-prev'
        },
        loop: false,
        breakpoints: {
          320: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 }
        }
      });
    }
  }

  private initializeCarDetails() {
    if (!this.vehicleData) return;

    this.carDetails = [
      { icon: 'body', label: 'body', value: this.vehicleData.bodytype_data[0]?.name },
      { icon: 'mileage', label: 'mileage', value: this.vehicleData.mileage },
      { icon: 'fuel', label: 'fuel type', value: this.vehicleData.fuelType },
      { icon: 'transmission', label: 'transmission', value: this.vehicleData.transmission },
      { icon: 'engine', label: 'engine', value: this.vehicleData.engine_size },
      { icon: 'doors', label: 'doors', value: this.vehicleData.door_count },
      // { icon: 'year', label: 'year', value: this.vehicleData.year },
      { icon: 'year', label: 'year', value: this.vehicleData.year?.toString()?.split('-')[0] || this.vehicleData.year },
      { icon: 'drive', label: 'drive type', value: this.vehicleData.drive_type },
      { icon: 'color', label: 'color', value: this.vehicleData.color_data[0]?.name }
    ];

    if (this.vehicleData.media_data?.length > 0) {
      this.images.push({
        src: `${this.backendURl}/media/${this.vehicleData.media_data[0].src}`,
        alt: this.vehicleData.media_data[0].name,
        isActive: false
      });
    }

    this.vehicleData.gallery_image?.forEach(gal => {
      this.images.push({
        src: `${this.backendURl}/media/${gal.src}`,
        alt: gal.name,
        isActive: false
      });
    });

    if (this.images.length > 0) {
      this.setActiveImageById(this.images[0]);
    }
  }

  setActiveImageById(image: CarImage) {
    this.images = this.images.map(img => ({
      ...img,
      isActive: img.src === image.src
    }));
    this.currentIndex = this.images.findIndex(img => img.src === image.src);
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    if (index >= 0 && index < this.images.length) {
      this.currentIndex = index;
      this.images = this.images.map((img, i) => ({ ...img, isActive: i === index }));
    }
  }

  getCarDetailUrl(carName: string): string[] {
    const slug = carName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return ['/product', slug];
  }

}