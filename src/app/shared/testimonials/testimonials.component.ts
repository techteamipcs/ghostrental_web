import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { Swiper } from 'swiper';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('swiper') swiperRef!: ElementRef;
  @ViewChild('nextButton') nextButton!: ElementRef;
  @ViewChild('prevButton') prevButton!: ElementRef;
  private swiper: Swiper | null = null;
  imageURL: string = `${environment.url}/assets`;
  backendURL: string = `${environment.baseUrl}/public`;
  testimonialsData: any = [];
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
      answer: 'We offer an elite fleet of luxury and exotic cars for rent in Dubai, including top brands like Ferrari, Lamborghini, Rolls-Royce, Bentley, and McLaren. All our vehicles are insured, clean and well maintained and our help desk can be contacted on a 24-hours basis. Please browse through our site to check out the complete range of cars that we offer.'
    },
    {
      id: 'faq3',
      question: 'Can a reservation be modified or cancelled?',
      answer: 'You may modify or terminate your existing reservation by getting in touch with one of our customer service representatives. We kindly request that all changes be made at least 48 hours. In any event, if the customer cancels or modifies their booking within 48 hours, an additional fee may be charged. Our team is available 24/7 to assist you with a smooth and flexible booking experience across the UAE.'
    },
    {
      id: 'faq4',
      question: 'What about late return fees?',
      answer: 'Our luxury car rentals in Dubai operate on a 24-hour cycle with a 1-hour grace period for returns. However, after the grace period, hourly charges will be applicable. After 3 hours, full-day late charges will be applicable. Please note: surcharges, protection fees, and optional add-ons do not include a grace period for such things; full-day charges apply immediately upon delay.'
    },
    {
      id: 'faq5',
      question: 'Is roadside assistance offered in case I have problems with my car?',
      answer: 'We offer 24/7 roadside assistance for all our luxury car rentals across Dubai and the UAE. If you have difficulties with your rental car, please contact our team immediately. If there are any minor problems that can be addressed on the spot, we will dispatch our operations team to assist you right away. In the unlikely event that your car faces a malfunction, get in touch with our sales department for car replacement or assistance. However, in this case, do not leave your vehicle and wait for service or the police to arrive.'
    },
    {
      id: 'faq6',
      question: 'How do I book a Dubai luxury car rental?',
      answer: 'The booking process for Dubai luxury car rental is easy and straightforward. Simply visit our website, select your desired luxury car, enter your payment details, and make the reservation.'
    },
    {
      id: 'faq7',
      question: 'Can I book more than one vehicle at once?',
      answer: 'Yes, you can book multiple luxury cars at once with GhostRental.ae. Whether it’s for a wedding convoy, VIP event, or corporate travel, our booking process is designed to handle group rentals effortlessly. Simply select your desired cars and make the booking. Our team will be happy to help if you have any questions or queries about this process.'
    }
  ];

  constructor(private ngZone: NgZone, public dataservice: DataService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.getTestimonials();
  }


  getTestimonials() {
    let obj = {};
    this.dataservice.getTestimonials(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.testimonialsData = response.result;
        }
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Use setTimeout to ensure the view is fully rendered
      setTimeout(() => {
        this.initSwiper();
      });
    });
  }

  public initSwiper(): void {
    if (this.swiperRef?.nativeElement && !this.swiper) {
      try {
        if (isPlatformBrowser(this.platformId)) {
        this.swiper = new Swiper(this.swiperRef.nativeElement, {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          navigation: false,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
          },
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          breakpoints: {
            768: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            992: {
              slidesPerView: 1,
              spaceBetween: 30,
            },
          },
          on: {
            init: () => {
            },
            slideChange: () => {
            },
          },
        });

        if (this.nextButton?.nativeElement && this.prevButton?.nativeElement) {
          this.nextButton.nativeElement.addEventListener('click', () => {
            this.swiper?.slideNext();
          });

          this.prevButton.nativeElement.addEventListener('click', () => {
            this.swiper?.slidePrev();
          });
        }
      }
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.nextButton?.nativeElement) {
      this.nextButton.nativeElement.removeEventListener('click', () => { });
    }
    if (this.prevButton?.nativeElement) {
      this.prevButton.nativeElement.removeEventListener('click', () => { });
    }

    if (this.swiper) {
      try {
        this.swiper.destroy(true, true);
      } catch (error) {
        console.error('Error destroying Swiper:', error);
      } finally {
        this.swiper = null;
      }
    }
  }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}
