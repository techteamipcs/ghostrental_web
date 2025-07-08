import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, AfterViewInit, HostListener, inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';     
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { DataService } from '../../providers/data/data.service';
import { Router } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2'
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ContactService } from '../../providers/contact/contact.service';
import { PageService } from '../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

Swiper.use([Navigation]);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});


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
  selecteddropaddress: any;
  availableStartDate: any;
  locationData: any = [];
  pickupLocations: any = [];
  dropLocations: any = [];
  showPopup: boolean = false;
  throw_msg: any;
  addcontactForm: FormGroup;
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  prod: any;
  isvalidSubmit: boolean = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  separateDialCode = false;
  isReservationFilled = true;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.UnitedArabEmirates];
  isPopupOpen: boolean = false;
  isHovered = false;
  featuresList:any = [];
  filteredFeatures: any = [];
  yatchSizes = ['Up To 30 ft','31-49 ft','50-69 ft','70-99 ft','100-149 ft','> 150 ft'];
  yatchSeats = ['8','10','12','20','25','40','100'];
  yatchHours = ['4','8','12','16','24'];
  // whatsappURL =  `${environment.url}/assets/images/icons`;
  @ViewChild('trendingCarsCarousel', { static: false }) carousel!: ElementRef;
  selectedYatchSize: any;
  selectedYatchSeats: any;
  selectedYatchHours: any;
  selectedYatchAddOns: any = [];
  minDate: any;
  onDateChange(event: any) {
    // This method is triggered when the date input changes
    // The [(ngModel)] will automatically update selelctedstartDate
  }
  features = [
    {
      image: 'images/icons/cars.png',
      title: 'Premium Yachts and Cars',
      description: 'Premium Cars and Yacht Rentals suitable for family use.',

    },
    {
      image: 'images/icons/hand.png',
      title: 'Family-First Service',
      description: 'Building Lasting Relationships Through Exceptional Service.',
    },
    {
      image: 'images/icons/fullday.png',
      title: 'Booking Experience',
      description: 'instant 24/7 booking access for instant luxury rental convenience in dubai',
    },
    {
      image: 'images/icons/earth.png',
      title: 'Total UAE Coverage',
      description: 'Complete UAE Service Accompanied By Luxury Delivered To Your House.',
    }
  ];

  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private dataservice: DataService,
    public router: Router,
    private contactservice: ContactService,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.addcontactForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
    // const todayDate = new Date();
    // this.today = todayDate.toISOString().split('T')[0];
    // const futureDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
    // this.maxDate = futureDate.toISOString().split('T')[0];
    // this.pickuptoday = this.today;
    // this.dropofftoday = this.today;
    this.get_PageMeta();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
    this.pickuptoday = this.minDate;
    this.dropofftoday = this.minDate;
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
    this.getFeatures();
    this.getLocations();
    this.initYachtSwiper();
    this.initTrendingSwiper();
    this.initCarSwiper();
  }

  get_PageMeta() {
		let obj = { pageName: 'home' };
		this.pageservice.getpageWithName(obj).subscribe((response) => {
			if (response.body.code == 200) {
				this.titleService.setTitle(response?.body.result.meta_title);
				this.metaTagService.updateTag({
					name: 'description',
					content: response?.body.result.meta_description,
				});
				this.metaTagService.updateTag({
					name: 'keywords',
					content: response?.body.result.meta_keywords,
				});
			} else if (response.code == 400) {
			} else {
			}
		});
	}

  ngAfterViewInit() {

    // Initialize Bootstrap Carousel
    if (isPlatformBrowser(this.platformId) && (window as any).bootstrap) {
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        this.carouselInstance = new (window as any).bootstrap.Carousel(carouselEl, {
          interval: false,
          touch: true
        });
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    let tempData = { };
    if(this.vehicletype ){
      tempData['Vehicle'] = this.vehicletype;
    }
    if(this.selelctedbrand) {
      tempData['Brand'] = this.selelctedbrand;
    }
    if(this.selelctedbodytype) {
      tempData['Type'] = this.selelctedbodytype;
    }
    if(this.selelctedmodel) {
      tempData['Model'] = this.selelctedmodel;
    }
    if(this.selectedpickaddress ) {
      tempData['Pickup Address'] = this.selectedpickaddress;
    }
    if(this.selecteddropaddress) {
      tempData['Drop Address'] = this.selecteddropaddress;
    }
    if(this.selelctedstartDate ) {
      tempData['Pickup Date'] = this.selelctedstartDate;
    }
    if(this.selectedstartTime) {
      tempData['Pick Time'] = this.selectedstartTime;
    }
    if(this.selelctedendDate ) {
      tempData['Drop Date'] = this.selelctedendDate;
    }
    if(this.selectedendTime) {
      tempData['Drop Time'] = this.selectedendTime;
    }
    if(this.selectedYatchSize ){
    tempData['Size'] = this.vehicletype;
    }
    if(this.selectedYatchSeats) {
      tempData['Seats'] = this.selectedYatchSeats;
    }
    if(this.selectedYatchHours) {
      tempData['Hours'] = this.selectedYatchHours;
    }
    if(this.selectedYatchAddOns && this.selectedYatchAddOns.length > 0) {
      let tempspl = [];
      this.selectedYatchAddOns.forEach((spladds)=>{
        tempspl.push(spladds.name)
      });
      tempData['Special Add-ons'] = tempspl;
    }
    let obj = this.addcontactForm.value;
    if (this.prod) {
      obj['product'] = this.prod;
    }
    if(tempData){
      obj['seacrh_data'] = tempData;
    }
    if (this.addcontactForm.invalid) {
      return;
    }
    if (this.isvalidSubmit == false) {
      return
    }
    obj['phone'] = obj.phone.internationalNumber;
    this.contactservice.addQuickSearch(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message;
          this.msg_success = true;
          this.submitted = true;
          setTimeout(() => {
            // this.sendContactEmial(obj);
            this.submitted = false;
            this.addcontactForm.reset();
            this.isvalidSubmit = true;
            window.location.reload();
          }, 5000);
        }
        else if (response.code == 400) {
          this.throw_msg = response.message;
          this.addcontactForm.reset();
          this.msg_danger = true;
        }
      },
    );

  }

  sendContactEmial(data) {
		let obj = data;
		if (!data) {
			return;
		}
		this.contactservice.addContact(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					this.throw_msg = response.message;
					this.msg_success = true;
				}
				else if (response.code == 400) {
					this.throw_msg = response.message;
					this.msg_danger = true;
				}
			},
		);
	}

  private carouselInstance: any;

  prevSlide() {
    if (this.carouselInstance) {
      this.carouselInstance.prev();
    } else {
      // Fallback to jQuery if needed
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        const bsCarousel = (window as any).bootstrap.Carousel.getInstance(carouselEl);
        if (bsCarousel) {
          bsCarousel.prev();
        }
      }
    }
  }
  
  nextSlide() {
    if (this.carouselInstance) {
      this.carouselInstance.next();
    } else {
      // Fallback to jQuery if needed
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        const bsCarousel = (window as any).bootstrap.Carousel.getInstance(carouselEl);
        if (bsCarousel) {
          bsCarousel.next();
        }
      }
    }
  }
  public hasError = (controlName: string, errorName: string) => {
		return this.addcontactForm.controls[controlName].hasError(errorName);
	};
  public hasEmailError = (controlName: string, errorName: string) => {
    if (this.addcontactForm.controls['email'].value == "") {
      return "Email is required";
    } else if (this.addcontactForm.controls['email'].status == "INVALID") {
      return "Invalid Email";
    } else {
      return this.addcontactForm.controls['email'].hasError(errorName);
    }
  };

  public hasPhoneNumberError = (controlName: string, errorName: string) => {
    if (this.addcontactForm.controls['phone'].value == "") {
      return "Phone Number is required";
    } else if (this.addcontactForm.controls['phone'].status == "INVALID") {
      return "Invalid Phone Number";
    } else {
      return this.addcontactForm.controls['phone'].hasError(errorName);
    }
  };

  openPopup() {
    let isValid = true;
    if(this.vehicletype == 'Car' && !this.selectedpickaddress){
      isValid = false;
    }
    if(this.vehicletype == 'Car' && !this.selecteddropaddress){
      isValid = false;
    }
    if(this.vehicletype == 'Car' && !this.selelctedbrand) {
      isValid = false;
    }
    if(this.vehicletype == 'Car' && !this.selelctedbodytype) {
      isValid = false;
    }
    if(this.vehicletype == 'Yachts' && !this.selelctedbodytype) {
      isValid = false;
    }
    if(this.vehicletype == 'Yachts' && !this.selectedYatchSize) {
      isValid = false;
    }
    if(this.vehicletype == 'Yachts' && !this.selectedYatchSeats) {
      isValid = false;
    }
    if(this.vehicletype == 'Yachts' && !this.selectedYatchHours) {
      isValid = false;
    }
    if(!this.selelctedstartDate) {
      isValid = false;
    }
    if(!isValid){
      this.isReservationFilled = false;
      return;
    }
    // this.showPopup = true;
    // this.isReservationFilled = true;
    // if (isPlatformBrowser(this.platformId)) {
    //   // Store the current scroll position
    //   const scrollY = window.scrollY;
    //   // Add class to body to prevent scrolling
    //   document.body.style.position = 'fixed';
    //   document.body.style.top = `-${scrollY}px`;
    //   document.body.style.width = '100%';
    //   document.body.style.overflow = 'hidden';
    // }
    let tempspl = [];
    let tempvar:any = '';
    if(this.selectedAddons && this.selectedAddons.length > 0) {
      this.selectedAddons.forEach((spladds,index)=>{
        tempspl.push(index+'. '+spladds.name+'\n');
        index = index + 1;
        tempvar += index+'. '+spladds.name+'\n';
      });
    }
    let tempspladdons
    if(tempspl && tempspl.length > 0){
      tempspladdons = JSON.stringify(tempspl).replace(/"/g, '');
    }     
    if(this.vehicletype == 'Car'){
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nService Type: ${this.vehicletype},\nBrand: ${this.selelctedbrand},\nPickup Address: ${this.selectedpickaddress},\nDrop Address: ${this.selecteddropaddress},\nPickup Date: ${this.selelctedstartDate} ${!this.selectedstartTime? '':this.selectedstartTime},\nDrop Date: ${this.selelctedendDate} ${!this.selectedendTime? '':this.selectedendTime},\n${!tempspladdons ? '':'Special Add-ons: \n'+tempvar}\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "+97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    } else {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nService Type: ${this.vehicletype},\nSize: ${this.selectedYatchSize},\nPax: ${this.selectedYatchSeats},\nHours: ${this.selectedYatchHours},\nPickup Date: ${this.selelctedstartDate} ${!this.selectedstartTime? '':this.selectedstartTime},\n${!tempspladdons ? '':'Special Add-ons: \n'+tempvar}\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "+97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    }
  }
  
  closePopup(event: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.showPopup = false;
    if (isPlatformBrowser(this.platformId)) {
      // Restore the scroll position and reset styles
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
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
        slidesPerView: 'auto', // This allows slides to size naturally
        centeredSlides: false, // Ensure slides are not centered
        breakpoints: {
          0: { 
            slidesPerView: 1, 
            spaceBetween: 10 
          },
          430: { 
            slidesPerView: 1, 
            spaceBetween: 10 
          },
           575: { 
            slidesPerView: 1, 
            spaceBetween: 15 
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20
            },
          992: { 
            slidesPerView: 3.5, 
            spaceBetween: 15 
          },
          1281: { 
            slidesPerView: 4.5, 
            spaceBetween: 20 
          },
          1400: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1921: {
            slidesPerView: 5.5,
            spaceBetween: 20
          }
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
            spaceBetween: 10 
          },
          430: { 
            slidesPerView: 1, 
            spaceBetween: 10 
          },
           575: { 
            slidesPerView: 1, 
            spaceBetween: 15 
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20
            },
          992: { 
            slidesPerView: 3.5, 
            spaceBetween: 15 
          },
          1281: { 
            slidesPerView: 4.5, 
            spaceBetween: 20 
          },
          1400: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1921: {
            slidesPerView: 5.5,
            spaceBetween: 20
          }
        },
      });
    }
  }

  public initTrendingSwiper() {
    if (isPlatformBrowser(this.platformId)) {
      this.trendingSwiper = new Swiper('.trending-cars-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        modules: [Navigation, Pagination, Autoplay],
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        centeredSlides: false,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          481: {
            slidesPerView: 1,
            spaceBetween: 10
          },
           575: {
            slidesPerView: 1.5,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20
            },
        },
        navigation: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
      });
    }
  }

  ngOnDestroy() {
    // Clean up Swiper instances
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
    
    // Clean up popup state if still open
    this.showPopup = false;
    
    // Only access document in browser environment
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('popup-open');
    }
  }

  initForm() {
    this.reservationForm = this.formBuilder.group({
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
    this.selectedYatchAddOns = [];
    this.selectedAddons = [];
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
      this.filteredBrands = this.listBrands.filter((brand) => brand.type == this.vehicletype);
    }
    if (this.featuresList && this.featuresList.length > 0) {
      this.filteredFeatures = this.featuresList.filter((feature) => feature.vehicle_type == this.vehicletype);
    }
  }

  selectData(type, event) {
    if (type == 'body_type') {
      this.selelctedbodytype = event.target.value;
    } else if (type == 'brand') {
      this.selelctedbrand = event.target.value;
    }  else if (type == 'model') {
      this.selelctedmodel = event.target.value;
    } else if (type == 'feature') {
      this.selectedYatchAddOns.push(event.target.value);
    } else if (type == 'size') {
      this.selectedYatchSize = event.target.value;
    } else if (type == 'seats') {
      this.selectedYatchSeats = event.target.value;
    } else if (type == 'hours') {
      this.selectedYatchHours = event.target.value;
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
        drop_address: this.selecteddropaddress
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


  // onSubmit() {
  //   console.log('Submitted');
  //   console.log(this.reservationForm.value);
  // }

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

   getFeatures() {
    let obj = {};
    this.dataservice.getSpecialAddons(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.featuresList = response.result;
          if (this.featuresList && this.featuresList.length > 0) {
            this.filteredFeatures = this.featuresList.filter((feature) => feature.vehicle_type == this.vehicletype);
          }
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
      this.selecteddropaddress = loc.target.value;
      let tempLoc = this.locationData.filter((location) => location.name != loc.target.value);
      if (tempLoc.length > 0) {
        this.pickupLocations = tempLoc
      }
    }
  }

  onSelectPickupDate() {
    if (this.selelctedstartDate) {
      const today = new Date(this.selelctedstartDate);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.minDate = `${yyyy}-${mm}-${dd}`;
      this.dropofftoday = this.minDate;
    }
  }

  onSelectDropDate() {
    if (!this.selelctedstartDate) {
      Toast.fire({
        title: 'Please select pickup date first!',
        icon: 'warning',
      });
      this.selelctedendDate = '';
    }
  }



    toggleMenu(event?: Event): void {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
  
      this.isPopupOpen = !this.isPopupOpen;
  
      if (this.isPopupOpen) {
      } else {
        this.closeMenu();
      }
  
    }
  
    closeMenu(): void {
      this.isPopupOpen = false;
      const menuItems = document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
      menuItems.forEach((item) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
      });
    }
  
    @HostListener('document:click', ['$event'])
    onClick(event: Event): void {
      const target = event.target as HTMLElement;
      const menuButton = document.querySelector('.navbar-toggler');
      const menu = document.querySelector('.mobile-menu');
  
      if (this.isPopupOpen &&
        !target.closest('.mobile-menu') &&
        !target.closest('.navbar-toggler')) {
        this.toggleMenu();
      }
    }
  
    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
      if (window.innerWidth >= 768) {
        this.isPopupOpen = false;
      }
    }

    getAdditionalReq() {
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
  
  sendWhatsappmsg() {
    let obj = {};
    this.dataservice.sendWhatappMessage(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          let result = response.result;
        }
      }
    });
  }

  goToVehiclePage(type: string) {
    this.router.navigate(['/product/search'], { queryParams: { type } });
  }

  getFirstTwoWords(name:string) : string{
    if(!name) return "";
    return name.split(' ').slice(0,2).join(' ');
  }


  setIsHovered(isHovered: boolean) {
    this.isHovered = isHovered;
  }
  // getImagePath(): string {
  //   return `${this.whatsappURL}/whatsapp-${this.isHovered ? 'white' : 'green'}.svg`;
  // }

  isDropdownOpen = false;
selectedAddons: Array<{url_key: string, name: string}> = [];


toggleDropdown(event?: Event): void {
  if (event) {
    event.stopPropagation();
  }
  this.isDropdownOpen = !this.isDropdownOpen;
}

toggleSelection(addon: {url_key: string, name: string}, event: Event): void {
  event.stopPropagation();
  
  // Create a new array to trigger change detection
  const updatedAddons = [...this.selectedAddons];
  const index = updatedAddons.findIndex(a => a.url_key === addon.url_key);
  
  if (index > -1) {
    updatedAddons.splice(index, 1);
  } else {
    updatedAddons.push({...addon});
  }
  
  this.selectedAddons = updatedAddons;
  if (event) {
    this.selectedYatchAddOns.push(event.target);
  }
}

isSelected(addon: {url_key: string, name: string}): boolean {
  return this.selectedAddons.some(a => a.url_key === addon.url_key);
}

getSelectedAddonsLabel(): string {
  if (!this.selectedAddons || this.selectedAddons.length === 0) {
    return 'Choose Special Add-ons';
  } else if (this.selectedAddons.length === 1) {
    return this.selectedAddons[0].name;
  } else {
    return `${this.selectedAddons.length} add-ons selected`;
  }
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event): void {
  if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
    this.isDropdownOpen = false;
  }
}


}
