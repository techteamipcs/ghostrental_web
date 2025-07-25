import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../providers/data/data.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';
import { Options } from '@angular-slider/ngx-slider';
import { PageService } from '../../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {

  Math = Math;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  mobileFilterHeight: string = 'calc(100vh - 7.5rem)';
  isMobile: boolean = false;
  isFilterCollapsed: boolean = false;
  isMobileFilterVisible: boolean = false;
  selectedLength: string | null = null;
  yachtLengthOptions: string[] = [];

  // Pagination properties
  currentLimit = 12;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  private previousVehicleType: string; // Track previous vehicle type for pagination
  carTypes: any = [];
  vehicleData: any = [];
  pagedCars: any[] = [];
  totolvehicle = 0;
  cartypeData: any = [];
  bodyData: any = [];
  brandData: any = [];
  modelData: any = [];
  bodyTypeData: any = [];
  allBodyTypes: any[] = [];
  allBrands: any[] = [];
  selectedBodyTypeId: string = '';
  selectedBodytype: any = [];
  selectedBrand: any = [];
  selectedModel: any = [];
  selectedCartype: any = [];
  today: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  pickuptoday: string;
  dropofftoday: string;
  selectedRentalType: any;
  minPrice: any = 0;
  maxPrice: any = 20000;
  // price_type: any = 'dailyRate';
  filteredModel: any = [];
  price_type: any = '';
  availableStartDate: any;
  availableEndDate: any;
  vipNumberPlate: any = '';
  sort: any = '';
  param_type: any;
  vehicleType: any = '';
  @ViewChild('minPriceInput') minPriceInput!: ElementRef;
  @ViewChild('maxPriceInput') maxPriceInput!: ElementRef;
  @ViewChild('rangeMin') rangeMin!: ElementRef;
  @ViewChildren('selctModel') selctModel: QueryList<ElementRef>;
  @ViewChildren('specialNumberSelect') specialNumberSelect: QueryList<ElementRef>;
  @ViewChildren('rentalTypeSelect') rentalTypeSelect: QueryList<ElementRef>;
  @ViewChild('rangeMax') rangeMax!: ElementRef;
  @ViewChild('filterContainer') filterRef!: ElementRef;
  @ViewChild('resultsSection') resultsRef!: ElementRef;
  value: number = 40;
  highValue: number = 20000;
  options: Options = {
    floor: 0,
    ceil: 20000,
  };
  sliderVisible: any = false;



  constructor(
    private dataservice: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize mobile filter as closed
    this.param_type = this.route.snapshot.paramMap.get('type');
    if (this.param_type && this.param_type === 'vip') {
      this.vipNumberPlate = true;
    }
    const todayDate = new Date();
    // this.today = todayDate.toISOString().split('T')[0];
    const year = todayDate.getFullYear();
    const month = String(todayDate.getMonth() + 1).padStart(2, '0');
    const day = String(todayDate.getDate()).padStart(2, '0');
    const hours = String(todayDate.getHours()).padStart(2, '0');
    const minutes = String(todayDate.getMinutes()).padStart(2, '0');

    this.pickuptoday = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.dropofftoday = `${year}-${month}-${day}T${hours}:${minutes}`;
    this.get_PageMeta();
  }

  toggleSelectDropdown(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const chevron = select.nextElementSibling as HTMLElement;
    if (chevron) {
      if (select.classList.contains('expanded')) {
        chevron.style.transform = 'translateY(-50%)';
      } else {
        chevron.style.transform = 'translateY(-50%) rotate(180deg)';
      }
    }
    select.classList.toggle('expanded');
  }

  onSelectBlur(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const chevron = select.nextElementSibling as HTMLElement;
    if (chevron) {
      chevron.style.transform = 'translateY(-50%)';
    }
    select.classList.remove('expanded');
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 1199;
      this.isMobileFilterVisible = !this.isMobile;
      setTimeout(() => {
        this.sliderVisible = true;
      }, 200);
    }
    Promise.all([
      this.getBrands(),
      this.getCarTypes(),
      this.getModels(),
      this.getBodyTypes()
    ]).then(() => {
      this.route.queryParams.subscribe(params => {
        const type = params['type'];
        if (type) {
          this.vehicleType = type;
          if (this.isMobile) {
            this.SearchItems();
          } else {
            this.setVehicleType();
          }
        } else {
          this.processQueryParams(params);
        }
      });
    });
  }

  get_PageMeta() {
    let obj = { pageName: 'products' };
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

  setVehicleType() {
    if (this.vehicleType === 'Car') {
      this.maxPrice = 10000;
      this.currentLimit = 12;
      this.currentPage = 1;
      this.itemsPerPage = 12;
      this.price_type = 'dailyRate';
    } else if (this.vehicleType === 'Yachts') {
      this.maxPrice = 20000;
      this.currentLimit = 12;
      this.currentPage = 1;
      this.itemsPerPage = 12;
      this.price_type = 'hourlyRate';
    }
    this.filterBodyTypesByVehicleType(); // 👈 Filter data on vehicleType change
    this.getCarData();
  }

  ngAfterViewInit(): void {
    this.onScroll();
  }


  initializeSlider() {
    this.updateSlider();
    if (isPlatformBrowser(this.platformId)) {
      const minThumb = document.getElementById('thumb-min') as HTMLElement;
      const maxThumb = document.getElementById('thumb-max') as HTMLElement;
      const range = document.getElementById('slider-range') as HTMLElement;
      const slider = document.getElementById('slider') as HTMLElement;

      if (!minThumb || !maxThumb || !range || !slider) return;

      let isDragging = false;
      let activeThumb: HTMLElement | null = null;
      let startX = 0;
      let startLeft = 0;

      // Set initial positions

      // Mouse/Touch event handlers
      const startDrag = (e: MouseEvent | TouchEvent, thumb: HTMLElement) => {
        isDragging = true;
        activeThumb = thumb;
        startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        startLeft = parseInt(activeThumb.style.left || '0');
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
      };

      const onDrag = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !activeThumb) return;

        const sliderRect = slider.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        // Calculate new position
        let newLeft = startLeft + (clientX - startX);

        // Constrain to slider bounds
        newLeft = Math.max(0, Math.min(newLeft, sliderWidth));

        // Update thumb position
        activeThumb.style.left = `${newLeft}px`;

        // Update range fill
        this.updateRangeFill();

        // Update price values
        this.updatePricesFromSlider();
      };

      const stopDrag = () => {
        isDragging = false;
        activeThumb = null;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
      };

      // Add event listeners
      minThumb.addEventListener('mousedown', (e) => startDrag(e, minThumb));
      maxThumb.addEventListener('mousedown', (e) => startDrag(e, maxThumb));
      minThumb.addEventListener('touchstart', (e) => startDrag(e, minThumb));
      maxThumb.addEventListener('touchstart', (e) => startDrag(e, maxThumb));

      // Handle keyboard controls
      minThumb.setAttribute('tabindex', '0');
      maxThumb.setAttribute('tabindex', '0');

      const handleKeyDown = (e: KeyboardEvent, isMin: boolean) => {
        const thumb = isMin ? minThumb : maxThumb;
        const currentPos = parseInt(thumb.style.left || '0');
        const sliderWidth = slider.offsetWidth;
        const step = sliderWidth / 100; // 1% of slider width

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            thumb.style.left = `${Math.max(0, currentPos - step)}px`;
            break;
          case 'ArrowRight':
            e.preventDefault();
            thumb.style.left = `${Math.min(sliderWidth, currentPos + step)}px`;
            break;
          case 'Home':
            e.preventDefault();
            thumb.style.left = '0px';
            break;
          case 'End':
            e.preventDefault();
            thumb.style.left = `${sliderWidth}px`;
            break;
        }

        this.updateRangeFill();
        this.updatePricesFromSlider();
      };

      minThumb.addEventListener('keydown', (e) => handleKeyDown(e, true));
      maxThumb.addEventListener('keydown', (e) => handleKeyDown(e, false));
    }
  }



  updateSlider() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !slider) return;

    const sliderWidth = slider.offsetWidth;
    const minPos = (this.minPrice / 10000) * sliderWidth;
    const maxPos = (this.maxPrice / 10000) * sliderWidth;

    minThumb.style.left = `${minPos}px`;
    maxThumb.style.left = `${maxPos}px`;

    this.updateRangeFill();
  }

  updateRangeFill() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const range = document.getElementById('slider-range');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !range || !slider) return;

    const minPos = parseFloat(minThumb.style.left) || 0;
    const maxPos = parseFloat(maxThumb.style.left) || 100;
    const sliderWidth = slider.offsetWidth;

    // Ensure min is always left of max
    if (minPos > maxPos) {
      minThumb.style.left = `${maxPos}px`;
      maxThumb.style.left = `${minPos}px`;

      // Swap values if needed
      const temp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = temp;

      return this.updateRangeFill();
    }

    range.style.left = `${minPos}px`;
    range.style.width = `${maxPos - minPos}px`;
  }

  // Handle price input changes from the number inputs
  onPriceInputChange(type: 'min' | 'max') {
    // Ensure values are numbers
    this.minPrice = Number(this.minPrice) || 0;
    this.maxPrice = Number(this.maxPrice) || 200000;

    // Ensure min and max are within bounds
    if (this.minPrice < 0) this.minPrice = 0;
    if (this.maxPrice > 200000) this.maxPrice = 200000;

    // Ensure minimum gap between min and max
    const minGap = 500;
    if (this.maxPrice - this.minPrice < minGap) {
      if (type === 'min') {
        this.maxPrice = this.minPrice + minGap;
        if (this.maxPrice > 20000) {
          this.maxPrice = 20000;
          this.minPrice = 20000 - minGap;
        }
      } else {
        this.minPrice = this.maxPrice - minGap;
        if (this.minPrice < 0) {
          this.minPrice = 0;
          this.maxPrice = minGap;
        }
      }
    }

    // Update the slider UI
    this.updateSlider();
    // this.filterUpdate.next();
  }

  updatePricesFromSlider() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !slider) return;

    const sliderWidth = slider.offsetWidth;
    const minPos = parseFloat(minThumb.style.left) || 0;
    const maxPos = parseFloat(maxThumb.style.left) || 0;

    // Update price values based on thumb positions (0-10000 range)
    this.minPrice = Math.round((minPos / sliderWidth) * 10000);
    this.maxPrice = Math.round((maxPos / sliderWidth) * 10000);

    // Ensure minimum gap between thumbs (e.g., 500)
    const minGap = 500;
    if (this.maxPrice - this.minPrice < minGap) {
      if (minThumb === document.activeElement) {
        this.minPrice = this.maxPrice - minGap;
        if (this.minPrice < 0) this.minPrice = 0;
      } else {
        this.maxPrice = this.minPrice + minGap;
        if (this.maxPrice > 10000) this.maxPrice = 10000;
      }
      this.updateSlider();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totolvehicle / this.itemsPerPage);
  }

  updatePagedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedCars = this.vehicleData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCarData();
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    }
  }

  getPages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        this.mobileFilterHeight = 'calc(100vh - 5rem)';
      } else {
        this.mobileFilterHeight = 'calc(100vh - 7.5rem)';
      }

      const filter = this.filterRef.nativeElement;
      const results = this.resultsRef.nativeElement;

      const filterHeight = filter.offsetHeight;
      // const filterTop = filter.getBoundingClientRect().top;
      // const resultsBottom = results.getBoundingClientRect().bottom;

      // if (resultsBottom <= filterHeight + filterTop) {
      //   filter.style.position = 'relative';
      //   filter.style.bottom = '0';
      // } else {
      //   filter.style.position = 'sticky';
      //   filter.style.top = '8rem';
      // }
    }
  }

  // Process query parameters and update component state
  private processQueryParams(params: Params) {
    // Update component state from query params
    if (params['bodyType']) {
      this.selectedBodytype = [params['bodyType']];
    }
    if (params['brand']) {
      this.selectedBrand = [params['brand']];
      // Update filtered models based on selected brand
      if (this.modelData?.length) {
        this.filteredModel = this.modelData.filter(item => item.brand === params['brand']);
      }
    }
    if (params['model']) {
      this.selectedModel = [params['model']];
    }
    if (params['rentalType']) {
      this.selectedRentalType = params['rentalType'];
      this.changeRentalType({ target: { value: params['rentalType'] } });
    }
    if (params['minPrice']) {
      this.minPrice = +params['minPrice'];
    }
    if (params['maxPrice']) {
      this.maxPrice = +params['maxPrice'];
    }
    if (params['vip']) {
      this.vipNumberPlate = params['vip'] === 'true';
    }
    if (params['sort']) {
      this.sort = params['sort'];
    }

    // Fetch data after processing all params
    this.getCarData();
  }

  // Update query parameters based on current filters
  private updateQueryParams() {
    const queryParams: any = {};

    if (this.selectedBodytype?.length) queryParams.bodyType = this.selectedBodytype[0];
    if (this.selectedBrand?.length) queryParams.brand = this.selectedBrand[0];
    if (this.selectedModel?.length) queryParams.model = this.selectedModel[0];
    if (this.selectedRentalType) queryParams.rentalType = this.selectedRentalType;
    if (this.minPrice > 0) queryParams.minPrice = this.minPrice;
    if (this.maxPrice < 10000) queryParams.maxPrice = this.maxPrice;
    if (this.vipNumberPlate) queryParams.vip = this.vipNumberPlate;
    if (this.sort) queryParams.sort = this.sort;

    // Update URL without triggering navigation
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  // Public method to trigger search (can be called from template)
  SearchItems() {
    this.getCarData();
    if (this.isMobile) {
      this.isMobileFilterVisible = false;
    }
    window.scrollTo(0, 0);
  }


  resetFilter() {
    this.vehicleType = '';
    this.carTypes = '';
    this.selectedBodytype = [];
    this.selectedBrand = [];
    this.selectedModel = [];
    // this.selectedRentalType = 'Daily';
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.selectedRentalType = null;
    this.minPrice = 0;
    this.maxPrice = 150000;
    this.vipNumberPlate = false;
    this.sort = null;
    this.updateSlider();
    this.getCarData();
  }


  getCarData() {
    if (this.previousVehicleType !== this.vehicleType) {
      this.currentPage = 1;
      this.previousVehicleType = this.vehicleType;
    }

    const obj: any = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: this.vehicleType,
      car_type: this.carTypes,
      bodyTypeId: this.selectedBodytype,
      brandId: this.selectedBrand,
      modelId: this.selectedModel,
      rental_type: this.selectedRentalType,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      price_type: this.price_type,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      sort: this.sort,
      isvipNumberPlate: this.vipNumberPlate
    };

    if (this.vehicleType == 'Yachts') {
      if (this.selectedLength) {
        obj.length = this.selectedLength;
      }
    }

    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        this.totolvehicle = response.count;
        this.vehicleData = response.result;
        this.totalItems = response.count;
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          if (this.vehicleType == 'Yachts') {
            this.extractYachtLengths(response.result);
          }
          this.updatePagedCars();
        } else {
          this.vehicleData = [];
          this.yachtLengthOptions = [];
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

  getBrands() {
    const obj = {};
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code === 200 && response.result?.length > 0) {
        this.allBrands = response.result;
        this.filterBrandsByBodyType(); // Initial filtering
      }
    });
  }

  getModels() {
    let obj = {};
    this.dataservice.getAllModels(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.modelData = response.result;
        }
      }
    });
  }

  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.allBodyTypes = response.result;
          this.filterBodyTypesByVehicleType();

        }
      }
    });
  }

  filterBodyTypesByVehicleType() {
    this.bodyTypeData = this.allBodyTypes.filter(
      (item) => item.type === this.vehicleType
    );
  }

  filterBrandsByBodyType() {
    if (!this.selectedBodyTypeId) {
      this.brandData = [];
      return;
    }
    this.brandData = this.allBrands.filter(
      (brand) => brand.bodytype === this.selectedBodyTypeId
    );
  }

  // Call this when user selects a body type from UI
  onBodyTypeSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedBodyTypeId = selectedId;
    this.selectedBodytype = selectedId ? [selectedId] : [];
    this.selectedBrand = []; // Reset brand and model when body changes
    this.selectedModel = [];
    this.filterBrandsByBodyType();
    this.filteredModel = []; // Reset model list
    this.getCarData();
  }



  changeBodyType(data) {
    if (data?.target?.value) {
      this.selectedBodytype = [data.target.value];
    }
  }

  changeBrand(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedBrand = selectedId ? [selectedId] : [];
    this.selectedModel = [];
    if (selectedId && this.modelData.length > 0) {
      this.filteredModel = this.modelData.filter(item => item.brand === selectedId);
    } else {
      this.filteredModel = [];
    }
    this.getCarData();
  }

  changeModel(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedModel = selectedId ? [selectedId] : [];
    this.getCarData();
  }

  changeCartype(data) {
    if (data?.target?.value) {
      this.selectedCartype = [data.target.value];
    }
  }

  // Additional filters for Yachts
  onYachtBodyTypeSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedBodytype = selectedId ? [selectedId] : [];
    this.selectedLength = null;
    this.getFilteredVehicles();
  }

  onYachtLengthSelect(event: Event) {
    const selectedLength = (event.target as HTMLSelectElement).value;
    this.selectedLength = selectedLength || null;
    this.getFilteredVehicles();
  }

  getFilteredVehicles() {
    const obj: any = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: this.vehicleType,
      bodyTypeId: this.selectedBodytype,
      brandId: this.selectedBrand,
      modelId: this.selectedModel,
      rental_type: this.selectedRentalType,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      price_type: this.price_type,
      startDate: this.selectedStartDate,
      endDate: this.selectedEndDate,
      sort: this.sort,
      isvipNumberPlate: this.vipNumberPlate
    };

    if (this.vehicleType === 'Yachts') {
      if (this.selectedLength) {
        obj.length = this.selectedLength.trim();
      }
    }

    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code === 200) {
        this.vehicleData = response.result || [];
        this.totalItems = response.count || 0;

        // yachtLengthOptions should always reflect only available yachts in result
        if (this.vehicleType === 'Yachts') {
          this.extractYachtLengths(this.vehicleData);
          if (this.selectedLength) {
            this.vehicleData = this.vehicleData.filter(item => (item.length ?? '').trim() === this.selectedLength);
            this.totalItems = this.vehicleData.length;
          }
        }

        if (this.vehicleData.length > 0) {
          this.updatePagedCars();
        } else {
          if (this.vehicleType === 'Yachts') {
            this.yachtLengthOptions = [];
          }
        }
      }
    });
  }

  extractYachtLengths(data: any[]) {
    const allLengths = data.map(y => (y.length ?? '').trim()).filter(Boolean);
    const uniqueSorted = Array.from(new Set(allLengths)).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return isNaN(aNum) || isNaN(bNum) ? a.localeCompare(b) : aNum - bNum;
    });
    this.yachtLengthOptions = uniqueSorted;
  }


  changeRentalType(data) {
    if (data?.target?.value) {
      this.selectedRentalType = data.target.value;
      if (data.target.value === 'Daily') {
        this.price_type = 'dailyRate';
        this.maxPrice = 150000;
      } else if (data.target.value === 'Hourly') {
        this.price_type = 'hourlyRate';
        this.maxPrice = 20000;
      } else if (data.target.value === 'Weekly') {
        this.price_type = 'weeklyRate';
      } else if (data.target.value === 'Monthly') {
        this.price_type = 'monthlyRate';
      }
    }
  }

  onChangeSort(data) {
    if (data?.target?.value) {
      this.sort = data.target.value;
      this.getCarData();
    }
  }

  onChangeSpecialNumber(data) {
    if (data?.target?.value) {
      this.vipNumberPlate = data.target.value === 'true';
    } else {
      this.vipNumberPlate = false;
    }
  }

  // onChangevehicleType(data) {
  //   if (data?.target?.value) {
  //     this.vehicleType = data.target.value;
  //   } else {
  //     this.vehicleType = false;
  //   }
  //   if(this.vehicleType=='Yachts'){
  //     this.maxPrice = 1000000;
  //   }
  // }

  toggleFilter(): void {
    this.isMobileFilterVisible = !this.isMobileFilterVisible;
  }
  @HostListener('window:resize', [])
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 1199;
      this.isMobileFilterVisible = !this.isMobile;
    }
  }


  onSelectPickupDate() {
    if (this.selectedStartDate) {
      this.dropofftoday = this.selectedStartDate;
    }
  }

  onSelectDropDate() {
    if (!this.selectedStartDate) {
      Toast.fire({
        title: 'Please select pickup date first!',
        icon: 'warning',
      });
      this.selectedEndDate = '';
      this.availableEndDate = '';
    } else {
      this.availableEndDate = this.selectedEndDate;
    }
  }

  getFirstTwoWords(name: string): string {
    if (!name) return "";
    return name.split(' ').slice(0, 2).join(' ');
  }


}
