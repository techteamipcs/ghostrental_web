import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { DataService } from '../../providers/data/data.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2'

Swiper.use([Navigation]);


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  private carSwiper: Swiper | null = null;
  private yachtSwiper: Swiper | null = null;
  private trendingSwiper: Swiper | null = null;
  bannerData: any;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  cartypeData: any = [];
  brandsData: any = [];
  isCar: boolean = true;
  today: string;
  pickuptoday: string;
  dropofftoday: string;
  maxDate: string;
  reservationForm!: FormGroup;
  isVehicleYacht = false;
  ourCarCollections: any = [];
  ouryatchsCollections: any = [];
  trendingRentalCars: any = [];
  vehicleData: any = [];
  vehicletype: any = "Car";
  listBodytype: any = [];
  filteredBodytype: any = [];
  listModels: any = [];
  filteredModels: any = [];
  listBrands: any = [];
  filteredBrands: any = [];
  selelctedbodytype: any;
  selelctedbrand: any;
  selelctedmodel: any;
  selelctedstartDate: any;
  selelctedendDate: any;
  selectedstartTime: any;
  selectedendTime: any;
  selectedpickaddress: any;
  selecteddropaddredd: any;
  availableStartDate: any;
  locationData: any = [];
  pickupLocations: any = [];
  dropLocations: any = [];
  onDateChange(event: any) {
    // This method is triggered when the date input changes
    // The [(ngModel)] will automatically update selelctedstartDate
  }
  features = [
    {
      image: 'home/cars.png',
      title: 'Premium Yachts and Cars',
      description: 'Rolls-Royce, Ferrari, Lamborghini, Yachts Suitable For Family Use.',

    },
    {
      image: 'home/hand.png',
      title: 'Family-First Service',
      description: 'Building Lasting Relationships Through Exceptional Luxury Service.',
    },
    {
      image: 'home/fullday.png',
      title: 'Perfect booking experience',
      description: '24/7 Booking Access For Instant Luxury Rental Convenience In Dubai',
    },
    {
      image: 'home/earth.png',
      title: 'Total UAE Coverage',
      description: 'Complete UAE Service Accompanied By Luxury Delivered To Your House.',
    }
  ];

  constructor(
    private fb: FormBuilder,
    private dataservice: DataService,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const todayDate = new Date();
    this.today = todayDate.toISOString().split('T')[0];
    const futureDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
    this.maxDate = futureDate.toISOString().split('T')[0];
    this.pickuptoday = this.today;
    this.dropofftoday = this.today;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0)
    }
    this.initForm();
    this.getBannerData();
    this.getCarTypes();
    this.getCarData();
    this.getYatchsData();
    this.getBodyTypes();
    this.getModels();
    this.getBrands();
    this.getLocations();
    this.initYachtSwiper();
    this.initTrendingSwiper();
  }

  ngAfterViewInit() {
    this.initCarSwiper();

  }

  public initCarSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      const swiper = new Swiper('.car-collection-swiper', {
        loop: true,
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.car-swiper-button-next',
          prevEl: '.car-swiper-button-prev',
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        breakpoints: {
          0: { slidesPerView: 1, spaceBetween: 10 },
          768: { slidesPerView: 2.5, spaceBetween: 15 },
          1200: { slidesPerView: 4.5, spaceBetween: 20 },
        },
      });
    }
  }



  public initYachtSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      const swiper = new Swiper('.yacht-collection-swiper', {
        loop: true,
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '.yacht-swiper-button-next',
          prevEl: '.yacht-swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 15,
          },
          1280: {
            slidesPerView: 4.5,
            spaceBetween: 20,
          },
        },
      });
    }
  }

  public initTrendingSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      this.trendingSwiper = new Swiper('.trending-cars-swiper', {
        loop: true,
        spaceBetween: 20,
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '.trending-swiper-button-next',
          prevEl: '.trending-swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          430: {
            slidesPerView: 1.5,
            spaceBetween: 15,
          },
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
    if (this.trendingSwiper) {
      this.trendingSwiper?.destroy(true, true);
      this.trendingSwiper = null;
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
    if (!this.isVehicleYacht) {
      this.vehicletype = "Car";
    } else {
      this.vehicletype = "Yachts";
    }
    if (this.listBodytype && this.listBodytype.length > 0) {
      this.filteredBodytype = this.listBodytype.filter((bodytype) => bodytype.type == this.vehicletype);
    }
    if (this.listModels && this.listModels.length > 0) {
      this.filteredModels = this.listModels.filter((model) => model.type == this.vehicletype);
    }
    if (this.listBrands && this.listBrands.length > 0) {
      this.filteredBrands = this.listBrands.filter((model) => model.type == this.vehicletype);
    }
  }

  selectData(type, event) {
    if (type == 'body_type') {
      this.selelctedbodytype = event.target.value;
    } else if (type == 'brand') {
      this.selelctedbrand = event.target.value;
    }
  }

  goToResults() {
    this.router.navigate(['/booking'], {
      queryParams: {
        vehicle: this.vehicletype,
        body_type: this.selelctedbodytype,
        brand: this.selelctedbrand,
        model: this.selelctedmodel,
        startDate: this.mergeDateTime(this.selectedstartTime, this.selelctedstartDate),
        endDate: this.mergeDateTime(this.selectedendTime, this.selelctedendDate),
        pick_address: this.selectedpickaddress,
        drop_address: this.selecteddropaddredd
      }
    });
  }

  mergeDateTime(time, date): any {
    if (time && date) {
      const [hours, minutes] = time.split(':').map(Number);
      const dateObj = new Date(date);
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      return dateObj;
    }
  }


  onSubmit() {
    console.log('Submitted');
    console.log(this.reservationForm.value);
  }

  getBannerData() {
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          response.result.forEach(banner => {
            if (banner && banner.page == 'home') {
              this.bannerData = banner;
            }
          });
        }
      }
    });
  }

  getCarTypes() {
    let obj = {};
    this.dataservice.getCarTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.cartypeData = response.result;
        }
      }
    });
  }

  getCarData() {
    let obj = {
      limit: 10,
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: "Car",
      home_vehicle: true
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          let index = 0;
          if (this.vehicleData && this.vehicleData.length > 0) {
            this.vehicleData.forEach((vehicle, i) => {
              if (vehicle && vehicle.home_vehicle) {
                this.ourCarCollections.push(vehicle);
              }
              if (vehicle && vehicle.featured_vehicle && index < 6) {
                index = index + 1
                this.trendingRentalCars.push(vehicle);
              }
            });
          }
        }
      }
    });
  }

  getYatchsData() {
    let obj = {
      limit: 10,
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: "Yachts",
      home_vehicle: true
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.ouryatchsCollections = response.result;
        }
      }
    });
  }

  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBodytype = response.result;
          if (this.listBodytype && this.listBodytype.length > 0) {
            this.filteredBodytype = this.listBodytype.filter((bodytype) => bodytype.type == this.vehicletype);
          }
        }
      }
    });
  }

  getModels() {
    let obj = {};
    this.dataservice.getAllModels(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listModels = response.result;
          if (this.listModels && this.listModels.length > 0) {
            this.filteredModels = this.listModels.filter((model) => model.type == this.vehicletype);
          }
        }
      }
    });
  }

  getBrands() {
    let obj = {};
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBrands = response.result;
          if (this.listBrands && this.listBrands.length > 0) {
            this.filteredBrands = this.listBrands.filter((model) => model.type == this.vehicletype);
          }
        }
      }
    });
  }

  getLocations() {
    let obj = {};
    this.dataservice.getAllLocations(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.locationData = response.result;
          this.pickupLocations = this.locationData;
          this.dropLocations = this.locationData;
        }
      }
    });
  }

  onSelectPickupLocation(loc) {
    if (loc && loc.target.value) {
      this.selectedpickaddress = loc.target.value;
      let tempLoc = this.locationData.filter((location) => location.name != loc.target.value);
      if (tempLoc.length > 0) {
        this.dropLocations = tempLoc
      }
    }
  }

  onSelectDropLocation(loc) {
    if (loc && loc.target.value) {
      this.selecteddropaddredd = loc.target.value;
      let tempLoc = this.locationData.filter((location) => location.name != loc.target.value);
      if (tempLoc.length > 0) {
        this.pickupLocations = tempLoc
      }
    }
  }

  onSelectPickupDate() {
    if(this.selelctedstartDate){
      this.dropofftoday = this.selelctedstartDate;
    }
  }

  onSelectDropDate() {
    if(!this.selelctedstartDate){
      Swal.fire({
        title: 'Please select pickup date first!',
        position: "top-end",
        icon: 'error'
      });
      this.selelctedendDate = '';
    }
  }
}

