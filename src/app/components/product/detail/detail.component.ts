import {
  Component, OnInit, HostListener, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, PLATFORM_ID, Inject
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../providers/data/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import * as moment from "moment";

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
  trendingRentalCars: any = [];
  ourCarCollections: any = [];
  currentIndex = 0;
  isLoading = true;
  relatedvehicleIds: any = [];
  existedVehicle: any;
  @ViewChild('stickyCard') stickyCard!: ElementRef;
  @ViewChild('stickyContainer') stickyContainer!: ElementRef;
  @ViewChild('carSwiper', { static: false }) carSwiperRef!: ElementRef;
  private stickyCardElement!: HTMLElement;
  private stickyContainerElement!: HTMLElement;
  private headerOffset = 150;
  private isSticky = false;
  private isBottomReached = false;
  private carSwiper: Swiper | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    public actRoute: ActivatedRoute,
    public dataservice: DataService, @Inject(PLATFORM_ID) private platformId: Object
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
    // Initialize car swiper after a small delay to ensure DOM is ready
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
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result[0];
          this.initializeCarDetails();
          if (this.vehicleData && this.vehicleData.related_vehicles && this.vehicleData.related_vehicles.length > 0) {
            this.relatedvehicleIds = this.vehicleData.related_vehicles;
          }
          this.getCarData();
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
      });
  }

  getCarData() {
    let obj = {
      limit: 10,
      page: 1,
      vehicle_Ids: this.relatedvehicleIds
    };
    this.dataservice.getvehiclewithIDs(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.relatedVehicleData = response.result;
        }
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

  public checkSticky() {
    if (!this.stickyCardElement || !this.stickyContainerElement) {
      ;
      if (isPlatformBrowser(this.platformId)) {
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
    }
  }

  public initCarSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize main car swiper if element exists
      if (this.carSwiperRef?.nativeElement) {
        this.carSwiper = new Swiper(this.carSwiperRef.nativeElement as HTMLElement, {
          modules: [Navigation],
          spaceBetween: 20,
          navigation: {
            nextEl: '.car-swiper-button-next',
            prevEl: '.car-swiper-button-prev'
          },
          loop: false,
          breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 15 },
            1024: { slidesPerView: 4.5, spaceBetween: 20 }
          }
        });
      }
      const relatedSwiperEl = document.querySelector('.car-collection-swiper') as HTMLElement;
      if (relatedSwiperEl && !(relatedSwiperEl as any).swiper) {
        new Swiper(relatedSwiperEl, {
          modules: [Navigation],
          spaceBetween: 20,
          navigation: {
            nextEl: '.car-swiper-button-next',
            prevEl: '.car-swiper-button-prev'
          },
          loop: true,
          breakpoints: {
            320: { slidesPerView: 1, },
            768: { slidesPerView: 2, },
            1024: { slidesPerView: 4.5, }
          }
        });
      }
    }
  }

  private initializeCarDetails() {
    if (this.vehicleData) {

      this.carDetails = [
        { icon: 'body', label: 'body', value: this.vehicleData.bodytype_data[0]?.name },
        { icon: 'mileage', label: 'mileage', value: this.vehicleData.mileage },
        { icon: 'fuel', label: 'fuel type', value: this.vehicleData.fuelType },
        { icon: 'transmission', label: 'transmission', value: this.vehicleData.transmission },
        { icon: 'engine', label: 'engine', value: this.vehicleData.engine_size },
        { icon: 'doors', label: 'doors', value: this.vehicleData.door_count },
        // { icon: 'year', label: 'year', value: this.vehicleData.year },
        { icon: 'year', label: 'year', value: new Date(this.vehicleData.year).getFullYear() },
        { icon: 'drive', label: 'drive type', value: this.vehicleData.drive_type },
        { icon: 'color', label: 'color', value: this.vehicleData.color_data[0]?.name }
      ];

      // if (this.vehicleData.media_data?.length > 0) {
      //   this.images.push({
      //     src: `${this.backendURl}/media/${this.vehicleData.media_data[0].src}`,
      //     alt: this.vehicleData.media_data[0].name,
      //     isActive: false
      //   });
      // }

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