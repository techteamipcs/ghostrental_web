import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Swiper from 'swiper';
import { environment } from '../../../environments/environment';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements AfterViewInit {
  @ViewChild('swiper') swiperRef!: ElementRef;
  imageURL: string = `${environment.baseUrl}/assets`;
  testimonials = [
    {
      image: 'testimonials/image1.jpg',
      rating: 5,
      title: '"Exceptional Service From Start To Finish!"',
      content: 'Rented A Rolls-Royce For My Wedding, And Everything Was Flawless. The Car Was Immaculate, The Chauffeur Was Professional, And The Whole Process Was Seamless.',
      name: 'M24 (Dorai Harrison)'
    },
    {
      image: 'testimonials/image2.jpg',
      rating: 4,
      title: '"Perfect Wedding Day!"',
      content: 'The limousine service was outstanding. The chauffeur was very professional and the car was in perfect condition. Highly recommend!',
      name: 'John Smith'
    },
    {
      image: 'testimonials/image3.jpg',
      rating: 5,
      title: '"Best Corporate Event Experience"',
      content: 'We rented multiple luxury cars for our corporate event. The service was exceptional and our guests were very impressed.',
      name: 'Sarah Johnson'
    },
    {
      image: 'testimonials/image4.jpg',
      rating: 4,
      title: '"Perfect for Family Vacation"',
      content: 'The car was comfortable and the service was excellent. The team was very helpful throughout our vacation.',
      name: 'Lisa Chen'
    },
    {
      image: 'testimonials/image5.jpg',
      rating: 5,
      title: '"Great Business Trip Experience"',
      content: 'Perfect service for our business trip. The cars were always on time and in excellent condition. Very professional team.',
      name: 'Robert Smith'
    }
  ];

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngAfterViewInit(): void {
    new Swiper(this.swiperRef.nativeElement, {
      modules: [Navigation],
      slidesPerView: 1,
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }
}
