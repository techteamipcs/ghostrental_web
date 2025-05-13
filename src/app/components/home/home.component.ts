import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';

// Swiper.use([Navigation]);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('carSwiper') carSwiperRef!: ElementRef;
  @ViewChild('yachtSwiper') yachtSwiperRef!: ElementRef;
  private carSwiper: Swiper | null = null;
  private yachtSwiper: Swiper | null = null;
  imageURL: string = `${environment.baseUrl}/assets`;
  isCar: boolean = true;
  today: string;
  maxDate: string;
  reservationForm!: FormGroup;


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

  yachtCollections = [
    {
      name: 'Luxury Yacht 1',
      image: 'home/collection/yachts/yacht1.png',
      type: 'Luxury',
      length: '80ft',
      cabins: '5',
      guests: '10',
      crew: '4',
      price: {
        regular: 15000,
        discounted: 13000
      }
    },

    {
      name: 'Sport Yacht 2',
      image: 'home/collection/yachts/yacht2.png',
      type: 'Sport',
      length: '65ft',
      cabins: '4',
      guests: '8',
      crew: '3',
      price: {
        regular: 12000,
        discounted: 11000
      }
    },
    {
      name: 'Luxury Yacht 1',
      image: 'home/collection/yachts/yacht1.png',
      type: 'Luxury',
      length: '80ft',
      cabins: '5',
      guests: '10',
      crew: '4',
      price: {
        regular: 15000,
        discounted: 13000
      }
    },
    {
      name: 'Party Yacht 3',
      image: 'home/collection/yachts/yacht3.png',
      type: 'Party',
      length: '90ft',
      cabins: '6',
      guests: '25',
      crew: '5',
      price: {
        regular: 18000,
        discounted: 16000
      }
    },
    {
      name: 'Luxury Yacht 4',
      image: 'home/collection/yachts/yacht4.png',
      type: 'Luxury',
      length: '75ft',
      cabins: '5',
      guests: '12',
      crew: '4',
      price: {
        regular: 14000,
        discounted: 12500
      }
    },
    {
      name: 'Sport Yacht 5',
      image: 'home/collection/yachts/yacht5.png',
      type: 'Sport',
      length: '70ft',
      cabins: '4',
      guests: '10',
      crew: '3',
      price: {
        regular: 13000,
        discounted: 11500
      }
    },
    {
      name: 'Luxury Yacht 4',
      image: 'home/collection/yachts/yacht4.png',
      type: 'Luxury',
      length: '75ft',
      cabins: '5',
      guests: '12',
      crew: '4',
      price: {
        regular: 14000,
        discounted: 12500
      }
    },
  ];

  features = [
    {
      image: 'home/cars.png',
      title: 'Elite Fleet',
      description: 'Curated collection of world-class vehicles and yachts',

    },
    {
      image: 'home/hand.png',
      title: 'White-Glove Service',
      description: 'VIP-level customer service & support',
    },
    {
      image: 'home/fullday.png',
      title: '24/7 Easy Booking',
      description: 'Seamless online booking and 24/7 availability',
    },
    {
      image: 'home/earth.png',
      title: 'UAE-Wide Coverage',
      description: 'Serving Dubai and all major UAE destinations',
    }
  ];

  carTypes = [
    { name: 'Convertible', image: 'home/car_categories/convertible.png' },
    { name: 'Coupe', image: 'home/car_categories/coupe.png' },
    { name: 'Hatch Back', image: 'home/car_categories/hatch-back.png' },
    { name: 'Sedan', image: 'home/car_categories/sedan.png' },
    { name: 'SUV', image: 'home/car_categories/suv.png' },
    { name: 'Truck', image: 'home/car_categories/truck.png' },
  ];

  trendingCars = [
    {
      name: 'Aston Martin',
      image: 'home/trending_cars/astom_martin.png',
      transmission: 'Automatic',
      price: {
        regular: 3500,
        discounted: 3000
      }
    },
    {
      name: 'Bentley',
      image: 'home/trending_cars/bentley.png',
      transmission: 'Automatic',
      price: {
        regular: 4000,
        discounted: 3500
      }
    },
    {
      name: 'BMW M3',
      image: 'home/trending_cars/bmw_m3.png',
      transmission: 'Automatic',
      price: {
        regular: 3000,
        discounted: 2500
      }
    },
    {
      name: 'Jeep Wrangler',
      image: 'home/trending_cars/jeep_wrath.png',
      transmission: 'Automatic',
      price: {
        regular: 2800,
        discounted: 2300
      }
    },
    {
      name: 'Lamborghini Huracan',
      image: 'home/trending_cars/lamborghini_huracan.png',
      transmission: 'Automatic',
      price: {
        regular: 5000,
        discounted: 4500
      }
    },
    {
      name: 'McLaren',
      image: 'home/trending_cars/mclaren.png',
      transmission: 'Automatic',
      price: {
        regular: 4500,
        discounted: 4000
      }
    },
    {
      name: 'Rolls Royce Wraith',
      image: 'home/trending_cars/rolls_royce_wraith.png',
      transmission: 'Automatic',
      price: {
        regular: 6000,
        discounted: 5500
      }
    }
  ]
  yachtTypes = ['Luxury', 'Sport', 'Party'];
  yachtSizes = ['Small', 'Medium', 'Large'];

  constructor(private fb: FormBuilder) {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    const futureDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
    this.maxDate = futureDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initCarSwiper();
    this.initYachtSwiper();
  }

  private initCarSwiper() {
    if (this.carSwiperRef?.nativeElement && !this.carSwiper) {
      this.carSwiper = new Swiper(this.carSwiperRef.nativeElement, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
          nextEl: '.car-swiper-button-next',
          prevEl: '.car-swiper-button-prev',
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 }
        },
        on: {
          init: () => this.updateCarNavButtons(),
          slideChange: () => this.updateCarNavButtons()
        }
      });
    }
  }

  private initYachtSwiper() {
    if (this.yachtSwiperRef?.nativeElement && !this.yachtSwiper) {
      this.yachtSwiper = new Swiper(this.yachtSwiperRef.nativeElement, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
          nextEl: '.yacht-swiper-button-next',
          prevEl: '.yacht-swiper-button-prev',
        },
        breakpoints: {
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 }
        },
        on: {
          init: () => this.updateYachtNavButtons(),
          slideChange: () => this.updateYachtNavButtons()
        }
      });
    }
  }


  private updateCarNavButtons() {
    if (!this.carSwiper) return;

    const prevButton = document.querySelector('.car-swiper-button-prev');
    const nextButton = document.querySelector('.car-swiper-button-next');

    if (prevButton) {
      prevButton.classList.toggle('swiper-button-disabled', this.carSwiper.isBeginning);
    }

    if (nextButton) {
      nextButton.classList.toggle('swiper-button-disabled', this.carSwiper.isEnd);
    }
  }

  private updateYachtNavButtons() {
    if (!this.yachtSwiper) return;

    const prevButton = document.querySelector('.yacht-swiper-button-prev');
    const nextButton = document.querySelector('.yacht-swiper-button-next');

    if (prevButton) {
      prevButton.classList.toggle('swiper-button-disabled', this.yachtSwiper.isBeginning);
    }

    if (nextButton) {
      nextButton.classList.toggle('swiper-button-disabled', this.yachtSwiper.isEnd);
    }
  }

  ngOnDestroy() {
    if (this.carSwiper) {
      this.carSwiper.destroy();
      this.carSwiper = null;
    }
    if (this.yachtSwiper) {
      this.yachtSwiper.destroy();
      this.yachtSwiper = null;
    }
  }

  initForm() {
    this.reservationForm = this.fb.group({
      vehicleType: ['Car'],
      type: [''],
      model: [''],
      pickupDate: [''],
      pickupTime: [''],
      pickupLocation: [''],
      returnDate: [''],
      returnTime: [''],
      returnLocation: [''],
      departureDate: [''],
      departureTime: [''],
      departureMarina: [''],
      returnMarina: ['']
    });
  }

  getCarCategoriesImageUrl(car: { image: string }): string {
    return `${this.imageURL}/${car.image}`;
  }


  toggleVehicle(type: 'Car' | 'Yacht') {
    this.isCar = type === 'Car';
    this.reservationForm.patchValue({ vehicleType: type });
  }

  onSubmit() {
    console.log('Submitted');
    console.log(this.reservationForm.value);
  }
}
