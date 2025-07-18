import { Component, HostListener, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';
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
export class HomeComponent implements OnInit {
  private carSwiper: Swiper | null = null;
  private yachtSwiper: Swiper | null = null;
  private trendingSwiper: Swiper | null = null;
  bannerData: any;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  cartypeData: any = [];
  brandsData: any = [];
  isCar: boolean = true;
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
  featuresList: any = [];
  filteredFeatures: any = [];
  yatchSizes = ['Up To 30 ft', '31-49 ft', '50-69 ft', '70-99 ft', '100-149 ft', '> 150 ft'];
  yatchSeats = ['8', '10', '12', '20', '25', '40', '100'];
  yatchHours = ['4', '8', '12', '16', '24'];
  @ViewChild('trendingCarsCarousel', { static: false }) carousel!: ElementRef;
  selectedYatchSize: any;
  selectedYatchSeats: any;
  selectedYatchHours: any;
  selectedYatchAddOns: any = [];
  selectedAddons: Array<{ url_key: string, name: string }> = [];
  isDropdownOpen = false;



  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  onDateChange(event: any) {
    // This method is triggered when the date input changes
    // The [(ngModel)] will automatically update selectedStartDate
  }
  // Form data structure
  formData = {
    type: '',
    brand: '',
    pickupDate: new Date(),
    pickupTime: new Date(),
    pickupLocation: '',
    dropDate: new Date(),
    dropTime: new Date(),
    dropLocation: '',
    addOns: ''
  };

  features = [
    {
      image: 'images/icons/cars.png',
      title: 'Premium Yachts and Cars',
      description: 'Premium Cars and Yacht Rentals Suitable for Family Use.',
    },
    {
      image: 'images/icons/hand.png',
      title: 'Family-First Service',
      description: 'Building Lasting Relationships Through Exceptional Service.',
    },
    {
      image: 'images/icons/247-white.svg',
      title: 'Booking Experience',
      description: 'Instant Booking With 24/7 Service Assistance.',
    },
    {
      image: 'images/icons/map-white.svg',
      title: 'UAE Coverage',
      description: 'Our Services Will Arrive At Your Doorstep Across Every UAE Emirate.',
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
    this.generateCalendar();
    this.generateEndCalendar();
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
    // this.pickuptoday = this.minDate;
    // this.dropofftoday = this.minDate;
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
    this.initializeTimePicker();
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
    let tempData = {};
    if (this.vehicletype) {
      tempData['Vehicle'] = this.vehicletype;
    }
    if (this.selelctedbrand) {
      tempData['Brand'] = this.selelctedbrand;
    }
    if (this.selelctedbodytype) {
      tempData['Type'] = this.selelctedbodytype;
    }
    if (this.selelctedmodel) {
      tempData['Model'] = this.selelctedmodel;
    }
    if (this.selectedpickaddress) {
      tempData['Pickup Address'] = this.selectedpickaddress;
    }
    if (this.selecteddropaddress) {
      tempData['Drop Address'] = this.selecteddropaddress;
    }
    if (this.selectedStartDate) {
      tempData['Pickup Date'] = this.selectedStartDate;
    }
    if (this.selectedStartTime) {
      tempData['Pick Time'] = this.selectedStartTime;
    }
    if (this.selectedEndDate) {
      tempData['Drop Date'] = this.selectedEndDate;
    }
    if (this.selectedEndTime) {
      tempData['Drop Time'] = this.selectedEndTime;
    }
    if (this.selectedYatchSize) {
      tempData['Size'] = this.vehicletype;
    }
    if (this.selectedYatchSeats) {
      tempData['Seats'] = this.selectedYatchSeats;
    }
    if (this.selectedYatchHours) {
      tempData['Hours'] = this.selectedYatchHours;
    }
    if (this.selectedYatchAddOns && this.selectedYatchAddOns.length > 0) {
      let tempspl = [];
      this.selectedYatchAddOns.forEach((spladds) => {
        tempspl.push(spladds.name)
      });
      tempData['Special Add-ons'] = tempspl;
    }
    let obj = this.addcontactForm.value;
    if (this.prod) {
      obj['product'] = this.prod;
    }
    if (tempData) {
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
    if (this.vehicletype == 'Car' && !this.selectedpickaddress) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selecteddropaddress) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selelctedbrand) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selelctedbodytype) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selelctedbodytype) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYatchSize) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYatchSeats) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYatchHours) {
      isValid = false;
    }
    if (!this.selectedStartDate) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selectedEndDate) {
      isValid = false;
    }
    if (!isValid) {
      this.isReservationFilled = false;
      return;
    }
    if(this.selectedStartDate){
      const today = new Date(this.selectedStartDate);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.selectedStartDate = `${yyyy}-${mm}-${dd}`;
    }
     if(this.selectedEndDate){
      const today = new Date(this.selectedEndDate);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.selectedEndDate = `${yyyy}-${mm}-${dd}`;
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
    let tempvar: any = '';
    if (this.selectedAddons && this.selectedAddons.length > 0) {
      this.selectedAddons.forEach((spladds, index) => {
        tempspl.push(index + '. ' + spladds.name + '\n');
        index = index + 1;
        tempvar += index + '. ' + spladds.name + '\n';
      });
    }
    let tempspladdons
    if (tempspl && tempspl.length > 0) {
      tempspladdons = JSON.stringify(tempspl).replace(/"/g, '');
    }
    if (this.vehicletype == 'Car') {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nService Type: ${this.vehicletype}\nBrand: ${this.selelctedbrand}\nPickup Address: ${this.selectedpickaddress}\nDrop Address: ${this.selecteddropaddress}\nPickup Date: ${this.selectedStartDate} ${!this.selectedStartTime ? '' : this.selectedStartTime}\nDrop Date: ${this.selectedEndDate} ${!this.selectedEndTime ? '' : this.selectedEndTime}\n${!tempspladdons ? '' : 'Special Add-ons: \n' + tempvar}\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "+97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    } else {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nService Type: ${this.vehicletype}\nSize: ${this.selectedYatchSize}\nPax: ${this.selectedYatchSeats}\nHours: ${this.selectedYatchHours}\nPickup Date: ${this.selectedStartDate} ${!this.selectedStartTime ? '' : this.selectedStartTime}\n${!tempspladdons ? '' : 'Special Add-ons: \n' + tempvar}\nThank you!`;
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
    
    // Reset time inputs to placeholders
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.selectedHour = '';
    this.selectedMinute = '';
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.isPM = false;
    this.isEndPM = false;
    
    // Reset dropdown states
    this.isDropdownOpen = false;
    this.showStartTimePicker = false;
    this.showEndTimePicker = false;
    this.showCalendar = false;
    this.showEndCalendar = false;
    
    
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
    } else if (type == 'model') {
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
        startDate: this.mergeDateTime(this.selectedStartTime, this.selectedStartDate),
        endDate: this.mergeDateTime(this.selectedEndTime, this.selectedEndDate),
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

  // onSelectPickupDate() {
  //   if (this.selectedStartDate) {
  //     const today = new Date(this.selectedStartDate);
  //     const yyyy = today.getFullYear();
  //     const mm = String(today.getMonth() + 1).padStart(2, '0');
  //     const dd = String(today.getDate()).padStart(2, '0');
  //     this.minDate = `${yyyy}-${mm}-${dd}`;
  //     this.dropofftoday = this.minDate;
  //   }
  // }

  // onSelectDropDate() {
  //   if (!this.selectedStartDate) {
  //     this.Toast.fire({
  //       title: 'Please select pickup date first!',
  //       icon: 'warning',
  //     });
  //     this.selectedEndDate = '';
  //   }
  // }



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

  getFirstTwoWords(name: string): string {
    if (!name) return "";
    return name.split(' ').slice(0, 2).join(' ');
  }


  setIsHovered(isHovered: boolean) {
    this.isHovered = isHovered;
  }
  // getImagePath(): string {
  //   return `${this.whatsappURL}/whatsapp-${this.isHovered ? 'white' : 'green'}.svg`;
  // }


  // toggleAddonsDropdown(event?: Event): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  toggleAddonsDropdown(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();
    
    if (!this.isDropdownOpen) {
      this.closeAllPickers();
    }
    
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleSelection(addon: { url_key: string, name: string }, event: Event): void {
    event.stopPropagation();

    const updatedAddons = [...this.selectedAddons];
    const index = updatedAddons.findIndex(a => a.url_key === addon.url_key);

    if (index > -1) {
      updatedAddons.splice(index, 1);
    } else {
      updatedAddons.push({ ...addon });
    }

    this.selectedAddons = updatedAddons;
    if (event) {
      this.selectedYatchAddOns.push(event.target);
    }
  }

  isSelected(addon: { url_key: string, name: string }): boolean {
    return this.selectedAddons.some(a => a.url_key === addon.url_key);
  }

  getSelectedAddonsLabel(): string {
    if (!this.selectedAddons || this.selectedAddons.length === 0) {
      return 'Choose Add-Ons';
    } else if (this.selectedAddons.length === 1) {
      return this.selectedAddons[0].name;
    } else {
      return `${this.selectedAddons.length} Add-Ons Selected`;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  

  // today: string;
  // pickuptoday: string;
  // dropofftoday: string;
  
  // date functionality
  // selectedStartDate: Date | null = null;
  // selectedEndDate: Date | null = null;
  showEndCalendar = false;
  endMonth: Date = new Date();
  selectedStartDate: any;
  selectedEndDate: any;
  selectedpickaddress: any;
  selecteddropaddress: any;
  availableStartDate: any;
  showCalendar = false;
  currentMonth: Date = new Date();
  calendarDates: Date[] = [];
  endCalendarDates: Date[] = [];
  dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
 
  // time functionality
  minDate: any;
  hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutes: string[] = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  selectedHour: string = '';
  selectedMinute: string = '';
  selectedEndHour: string = '';
  selectedEndMinute: string = '';
  showEndTimePicker = false;
  showAddOnsDropdown = false;
  isEndPM: boolean = false;
  showStartTimePicker: boolean = false;
  selectedStartTime: string = '';
  // selectedStartTime: any;
  selectedEndTime: string = '';
  // selectedStartTime: any;
  // selectedEndTime: any;
  isPM: boolean = false;
  displayHours: string[] = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Time picker state management
  private previousStartTime: { hour: string, minute: string, isPM: boolean } | null = null;
  private previousEndTime: { hour: string, minute: string, isPM: boolean } | null = null;


  generateCalendar() {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const dates: Date[] = [];

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    while (start <= lastDay || start.getDay() !== 0) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    this.calendarDates = dates;
  }

  isBeforeToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
  isBeforePickupDate(date: Date): boolean {
    if (!this.selectedStartDate) return false;
    const pickup = new Date(this.selectedStartDate);
    pickup.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < pickup;
  }
  
  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }
  
  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }
  

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.currentMonth.getMonth() &&
      date.getFullYear() === this.currentMonth.getFullYear()
    );
  }

  selectDate(date: Date) {
    this.selectedStartDate = new Date(date);
    this.showCalendar = false;
    // Update the form control if needed
    if (this.formData) {
      this.formData.pickupDate = this.selectedStartDate;
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelectedStartDate(date: Date): boolean {
    return (
      this.selectedStartDate &&
      date.getDate() === this.selectedStartDate.getDate() &&
      date.getMonth() === this.selectedStartDate.getMonth() &&
      date.getFullYear() === this.selectedStartDate.getFullYear()
    );
  }
  // private updateselectedStartTime() {
  //   if (this.selectedHour && this.selectedMinute) {
  //     this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
  //   }
  // }
  confirmTime() {
    if (this.selectedHour && this.selectedMinute) {
      let hour = parseInt(this.selectedHour, 10);
      if (this.isPM && hour < 12) hour += 12;
      if (!this.isPM && hour === 12) hour = 0;
  
      this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute} ${this.isPM ? 'PM' : 'AM'}`;
      this.showStartTimePicker = false;
  
      const time = new Date();
      time.setHours(hour, parseInt(this.selectedMinute, 10));
      this.formData.pickupTime = time;
      
      // Save the current time selection
      this.previousStartTime = {
        hour: this.selectedHour,
        minute: this.selectedMinute,
        isPM: this.isPM
      };
    }
  }
  // Add this method to check if a time is in the past
isPastTime(hour: number, minute: number): boolean {
  if (!this.selectedStartDate) return false;
  
  const now = new Date();
  const selectedTime = new Date(this.selectedStartDate);
  selectedTime.setHours(hour, minute, 0, 0);
  
  // If the selected date is today, check if time is in the past
  if (this.isToday(this.selectedStartDate)) {
    return selectedTime < now;
  }
  return false;
}

selectHour(hour: string) {
  const hourNum = parseInt(hour, 10);
  const minute = parseInt(this.selectedMinute || '0', 10);
  
  if (this.isPastTime(hourNum, minute)) {
    this.Toast.fire({ 
      icon: 'warning', 
      title: 'Please select a future time' 
    });
    return;
  }
  
  this.selectedHour = hour;
  // this.updateselectedStartTime();
}

selectMinute(minute: string) {
  if (!this.selectedHour) {
    this.Toast.fire({ 
      icon: 'warning', 
      title: 'Please select an hour first' 
    });
    return;
  }

  const hourNum = parseInt(this.selectedHour, 10);
  const minuteNum = parseInt(minute, 10);
  
  if (this.isPastTime(hourNum, minuteNum)) {
    this.Toast.fire({ 
      icon: 'warning', 
      title: 'Please select a future time' 
    });
    return;
  }
  
  this.selectedMinute = minute;
  // this.updateselectedStartTime();
}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const inStart = target.closest('.date-selector');
    const inEnd = target.closest('.end-date-selector');
    const inTime = target.closest('.time-selector');
    const inEndTime = target.closest('.end-time-selector');
    const inTimePicker = target.closest('.time-picker-dropdown');
    const inTimeInput = target.closest('.time-selector input');

    // Only close pickers if the click is outside all relevant elements
    if (!inStart) this.showCalendar = false;
    if (!inEnd) this.showEndCalendar = false;
    if (!inTime && !inTimePicker && !inTimeInput) this.showStartTimePicker = false;
    if (!inEndTime) this.showEndTimePicker = false;
    this.isDropdownOpen = false;
  }

  toggleCalendar(event?: MouseEvent) {
    event?.stopPropagation();
    this.closeAllPickers();
    this.showCalendar = !this.showCalendar;
  }

  toggleEndCalendar(event?: MouseEvent) {
    event?.stopPropagation();
    this.closeAllPickers();
    this.showEndCalendar = !this.showEndCalendar;
  }




  private initializeTimePicker() {
    this.updateDisplayHours();
    const now = new Date();
    this.isPM = now.getHours() >= 12;
    this.selectedHour = String(now.getHours() % 12 || 12).padStart(2, '0');
    this.selectedMinute = String(now.getMinutes()).padStart(2, '0');
    // this.updateselectedStartTime();
  }

  updateDisplayHours() {
    this.displayHours = Array.from({ length: 12 }, (_, i) => {
      return String(i + 1).padStart(2, '0');
    });
  }

  isSelectedHour(hour: string): boolean {
    return this.selectedHour === hour;
  }

  setAM() {
    this.isPM = false;
    // this.updateselectedStartTime();
  }

  setPM() {
    this.isPM = true;
    // this.updateselectedStartTime();
  }

  private closeAllPickers() {
    this.showCalendar = false;
    this.showEndCalendar = false;
    this.showStartTimePicker = false;
    this.showEndTimePicker = false;
    this.isDropdownOpen = false;
  }

  toggleStartTimePicker(event: MouseEvent) {
    event.stopPropagation();
    
    // Toggle the time picker
    this.showStartTimePicker = !this.showStartTimePicker;
    
    // Initialize time if not set
    if (this.showStartTimePicker && !this.selectedStartTime) {
      const now = new Date();
      const hours = now.getHours();
      this.isPM = hours >= 12;
      this.selectedHour = String(hours % 12 || 12).padStart(2, '0');
      this.selectedMinute = String(now.getMinutes()).padStart(2, '0');
    }
    
    // Close other pickers if opening this one
    if (this.showStartTimePicker) {
      this.showEndTimePicker = false;
      this.showCalendar = false;
      this.showEndCalendar = false;
    }
  }

  toggleEndTimePicker(event: MouseEvent) {
    event.stopPropagation();
    this.closeAllPickers();
    this.showEndTimePicker = !this.showEndTimePicker;

    if (this.showEndTimePicker && !this.selectedEndTime) {
      const now = new Date();
      const hours = now.getHours();
      this.isEndPM = hours >= 12;
      this.selectedEndHour = String(hours % 12 || 12).padStart(2, '0');
      this.selectedEndMinute = String(now.getMinutes()).padStart(2, '0');
      // this.updateselectedStartTime();
    }
  }


  

  // cancelTimeSelection() {
  //   this.showStartTimePicker = false;
  //   this.showEndTimePicker = false;
  //   if (!this.selectedStartTime) {
  //     this.selectedHour = '';
  //     this.selectedMinute = '';
  //     this.isPM = false;
  //   } else {
  //     const [hours, minutes] = this.selectedStartTime.split(':');
  //     const hourNum = parseInt(hours, 10);
  //     this.isPM = hourNum >= 12;
  //     this.selectedHour = String(hourNum % 12 || 12).padStart(2, '0');
  //     this.selectedMinute = minutes;
  //   }
  // }

  cancelTimeSelection() {
    // Restore previous time if it exists
    if (this.previousStartTime) {
      this.selectedHour = this.previousStartTime.hour;
      this.selectedMinute = this.previousStartTime.minute;
      this.isPM = this.previousStartTime.isPM;
    } else {
      // If no previous time, clear the selection
      this.selectedHour = '';
      this.selectedMinute = '';
    }
    this.showStartTimePicker = false;
  }

  
  validateDateTimeSelection() {
    if (!this.selectedStartDate || !this.selectedEndDate || !this.selectedStartTime || !this.selectedEndTime) return true;

    const start = new Date(this.selectedStartDate);
    const end = new Date(this.selectedEndDate);

    const [startHour, startMin] = this.selectedStartTime.split(/:| /);
    const [endHour, endMin] = this.selectedEndTime.split(/:| /);

    let startH = parseInt(startHour, 10);
    if (this.selectedStartTime.includes('PM') && startH < 12) startH += 12;
    if (this.selectedStartTime.includes('AM') && startH === 12) startH = 0;
    start.setHours(startH, parseInt(startMin, 10));

    let endH = parseInt(endHour, 10);
    if (this.selectedEndTime.includes('PM') && endH < 12) endH += 12;
    if (this.selectedEndTime.includes('AM') && endH === 12) endH = 0;
    end.setHours(endH, parseInt(endMin, 10));

    if (end < start) {
      this.Toast.fire({
        icon: 'warning',
        title: 'please select pickup time first'
      });
      return false;
    }

    return true;
  }


  selectEndHour(hour: string) {
    this.selectedEndHour = hour;
  }

  selectEndMinute(minute: string) {
    this.selectedEndMinute = minute;
  }

  setEndAM() {
    this.isEndPM = false;
  }

  setEndPM() {
    this.isEndPM = true;
  }

  cancelEndTimeSelection() {
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.showEndTimePicker = false;
  }

  confirmEndTime() {
    if (this.selectedEndHour && this.selectedEndMinute) {
      let hour = parseInt(this.selectedEndHour, 10);
      if (this.isEndPM && hour < 12) hour += 12;
      if (!this.isEndPM && hour === 12) hour = 0;

      this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute} ${this.isEndPM ? 'PM' : 'AM'}`;
      this.showEndTimePicker = false;

      const time = new Date();
      time.setHours(hour, parseInt(this.selectedEndMinute, 10));

      if (this.formData) {
        this.formData.dropTime = time;
      }

      this.validateDateTimeSelection();
    }
    
  }


  isSelectedEndHour(hour: string) {
    return this.selectedEndHour === hour;
  }



  // sfagags
  generateEndCalendar() {
    const firstDay = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth(), 1);
    const lastDay = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth() + 1, 0);
    const dates: Date[] = [];

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    while (start <= lastDay || start.getDay() !== 0) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    this.endCalendarDates = dates;
  }

  prevEndMonth() {
    this.endMonth.setMonth(this.endMonth.getMonth() - 1);
    this.generateEndCalendar();
  }

  nextEndMonth() {
    this.endMonth.setMonth(this.endMonth.getMonth() + 1);
    this.generateEndCalendar();
  }

  isEndMonth(date: Date): boolean {
    return (
      date.getMonth() === this.endMonth.getMonth() &&
      date.getFullYear() === this.endMonth.getFullYear()
    );
  }

  isSelectedEndDate(date: Date): boolean {
    return (
      this.selectedEndDate &&
      date.getDate() === this.selectedEndDate.getDate() &&
      date.getMonth() === this.selectedEndDate.getMonth() &&
      date.getFullYear() === this.selectedEndDate.getFullYear()
    );
  }

  selectEndDate(date: Date) {
    if (!this.selectedStartDate) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please Select Pickup Date First'
      });
      this.showEndCalendar = false;
      return;
    }
  
    const pickup = new Date(this.selectedStartDate);
    pickup.setHours(0, 0, 0, 0);
  
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
  
    if (selected < pickup) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please Select Pickup Date First'
      });
      return;
    }
  
    this.selectedEndDate = selected;
    this.showEndCalendar = false;
  }
  

}