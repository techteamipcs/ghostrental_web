import {
  Component, OnInit, HostListener, ElementRef, ViewChild,
  AfterViewInit, OnDestroy, PLATFORM_ID, Inject
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../providers/data/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

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
  thumbnailImage: any;
  @ViewChild('stickyCard') stickyCard!: ElementRef;
  @ViewChild('stickyContainer') stickyContainer!: ElementRef;
  private stickyCardElement!: HTMLElement;
  private stickyContainerElement!: HTMLElement;
  private headerOffset = 150;
  private isSticky = false;
  private isBottomReached = false;
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

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
          this.relatedVehicleData = response.result.slice(0, 4);
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


  private initializeCarDetails() {
    if (this.vehicleData) {
      if (this.vehicleData.vehicle_type == 'Car') {
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
      } else {
        this.carDetails = [
          { icon: 'ship', label: 'body', value: this.vehicleData.bodytype_data[0]?.name },
          { icon: 'length', label: 'length', value: this.vehicleData.length },
          { icon: 'fuel', label: 'fuel type', value: this.vehicleData.fuelType },
          { icon: 'engine', label: 'engine', value: this.vehicleData.engine_size },
          { icon: 'year', label: 'year', value: new Date(this.vehicleData.year).getFullYear() },
          { icon: 'material', label: 'hull material', value: this.vehicleData.hull_material },
          { icon: 'flag', label: 'flag', value: this.vehicleData.flag },
          { icon: 'crew', label: 'crew included', value: this.vehicleData.crew_included ? 'Yes' : 'No' },
          { icon: 'guests', label: 'guest capacity', value: this.vehicleData.guest_capacity },
          { icon: 'water', label: 'water capacity', value: this.vehicleData.water_capacity },
          { icon: 'fuel', label: 'fuel capacity', value: this.vehicleData.fuel_capacity },
          { icon: 'builder', label: 'builder', value: this.vehicleData.builder }
        ];
      }
      if (this.vehicleData.media_data?.length > 0) {
        this.thumbnailImage = `${this.backendURl}/media/${this.vehicleData.media_data[0].src}`
        // this.images.push({
        //   src: `${this.backendURl}/media/${this.vehicleData.media_data[0].src}`,
        //   alt: this.vehicleData.media_data[0].name,
        //   isActive: false
        // });
      }
      if(this.vehicleData.gallery_image && this.vehicleData.gallery_image.length > 0){
        this.vehicleData.gallery_image = this.vehicleData.gallery_image.sort((a, b) => a.sequence_number - b.sequence_number);
        this.vehicleData.gallery_image?.forEach(gal => {
          this.images.push({
            src: `${this.backendURl}/media/${gal.src}`,
            alt: gal.name,
            isActive: false
          });
        });
      }

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