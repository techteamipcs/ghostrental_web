import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

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
  currentIndex = 0;

  ngOnInit() {
    this.initializeImages();
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