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
  expandedIndex: number = -1;
  // Testimonials data
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

  // FAQ data
  faqs = [
    {
      id: 'faq1',
      question: 'How can I pay for my car rental?',
      answer: 'We have multiple payment options, including Visa, MasterCard, cash, American Express, online banking, and Bitcoin.'
    },
    {
      id: 'faq2',
      question: 'Which vehicles can I rent from Luxury Supercars?',
      answer: 'You can choose from a wide range of high-end vehicles including Lamborghini, Ferrari, Rolls-Royce, Bentley, and more.'
    },
    {
      id: 'faq3',
      question: 'Can a reservation be modified or cancelled?',
      answer: 'Yes, reservations can be modified or cancelled up to 24 hours before the pickup time without any charges.'
    },
    {
      id: 'faq4',
      question: 'What about late return fees?',
      answer: 'A late return fee may be charged if the vehicle is returned more than one hour past the agreed time without prior notice.'
    },
    {
      id: 'faq5',
      question: 'Is roadside assistance offered in case I have problems with my car?',
      answer: 'Yes, 24/7 roadside assistance is included with all our rentals to ensure your peace of mind.'
    },
    {
      id: 'faq6',
      question: 'How do I book a Dubai luxury car rental?',
      answer: 'You can book directly through our website, mobile app, or by calling our customer service hotline.'
    },
    {
      id: 'faq7',
      question: 'Can I book more than one vehicle at once?',
      answer: 'Yes, you can book multiple vehicles in one reservation. Just select the desired models during the booking process.'
    }
  ];


  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      new Swiper(this.swiperRef.nativeElement, {
        modules: [Navigation],
        slidesPerView: 1,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
      });
    }, 0);
  }

  // Accordion methods
  toggleAccordion(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}
