import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';
import { DataService } from '../../providers/data/data.service';

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
  bannerData: any;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  cartypeData:any = [];
  brandsData:any = [];
  isCar: boolean = true;
  today: string;
  maxDate: string;
  reservationForm!: FormGroup;
  isVehicleYacht = false;
  ourCarCollections:any = [];  
  ouryatchsCollections:any = [];
  trendingRentalCars:any = [];
  vehicleData:any = [];

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
  
  constructor(
    private fb: FormBuilder,
    private dataservice: DataService
  ) {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    const futureDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
    this.maxDate = futureDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initForm();
    this.getBannerData();
    this.getCarTypes();
    this.getCarData();
    this.getYatchsData();
  }

  ngAfterViewInit() {
    this.initCarSwiper();
    this.initYachtSwiper();
  }

  private initCarSwiper() {
    if (this.carSwiperRef?.nativeElement) {
      this.carSwiper = new Swiper(this.carSwiperRef.nativeElement, {
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


  private initYachtSwiper() {
    if (this.yachtSwiperRef?.nativeElement) {
      this.yachtSwiper = new Swiper(this.yachtSwiperRef.nativeElement, {
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
          nextEl: '.yacht-swiper-button-next',
          prevEl: '.yacht-swiper-button-prev',
        },
        breakpoints: {
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.carSwiper) {
      this.carSwiper?.destroy(true, true);
      this.carSwiper = null;
    }
    if (this.yachtSwiper) {
      this.yachtSwiper?.destroy(true, true);
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

  toggleVehicle() {
    this.isVehicleYacht = !this.isVehicleYacht;
  }
  onSubmit() {
    console.log('Submitted');
    console.log(this.reservationForm.value);
  }

  getBannerData(){
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          response.result.forEach(banner => {
            if(banner && banner.page == 'home'){
              this.bannerData = banner;
            }
          });        
        }
      }
    });
  }
  
  getCarTypes(){ 
    let obj = {};
    this.dataservice.getCarTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          this.cartypeData = response.result;
        }
      }
    });
  }

  getCarData(){
    let obj = {
      limit:10,
      page:1,
      availabilityStatus:'available',
      vehicle_type:"Car"
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          this.vehicleData = response.result;
          if(this.vehicleData && this.vehicleData.length > 0){
            this.vehicleData.forEach(vehicle => {
              if(vehicle && vehicle.home_vehicle){
                this.ourCarCollections.push(vehicle);
              } 
              if(vehicle && vehicle.featured_vehicle){
                this.trendingRentalCars.push(vehicle);
              }
            });
          }
        }
      }
    });
  }

  getYatchsData(){
    let obj = {
      limit:10,
      page:1,
      availabilityStatus:'available',
      vehicle_type:"Yachts"
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          this.ouryatchsCollections = response.result;
        }
      }
    });
  }
}
