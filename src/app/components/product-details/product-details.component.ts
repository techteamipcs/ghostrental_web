import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';

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
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;

  images: CarImage[] = [];
  carDetails: CarDetailItem[] = [];
  currentIndex = 0;
  @ViewChild('stickyCard') stickyCard!: ElementRef;
  @ViewChild('stickyContainer') stickyContainer!: ElementRef;

  private stickyCardElement!: HTMLElement;
  private stickyContainerElement!: HTMLElement;
  private headerOffset = 150; // Adjust this based on your header height
  private isSticky = false;
  private isBottomReached = false;

  ngOnInit() {
    this.initializeImages();
    this.initializeCarDetails();
  }

  ngAfterViewInit() {
    this.stickyCardElement = this.stickyCard.nativeElement;
    this.stickyContainerElement = this.stickyContainer.nativeElement;
    this.checkSticky();
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

  private initializeCarDetails() {
    // Single flat array of all car details
    this.carDetails = [
      { icon: 'body', label: 'body', value: 'sedan' },
      { icon: 'mileage', label: 'mileage', value: '28,000 miles' },
      { icon: 'fuel', label: 'fuel type', value: 'petrol' },
      { icon: 'transmission', label: 'transmission', value: 'automatic' },
      { icon: 'engine', label: 'engine', value: '4.8L' },
      { icon: 'doors', label: 'doors', value: '5-door' },
      { icon: 'year', label: 'year', value: '2023' },
      { icon: 'drive', label: 'drive type', value: 'front wheel drive' },
      { icon: 'color', label: 'color', value: 'blue' }
    ];
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
    // Set first image as active by default
    this.setActiveImageById(this.images[0]);
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