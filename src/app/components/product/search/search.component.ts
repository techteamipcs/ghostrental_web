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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
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
  Math = Math;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  mobileFilterHeight: string = 'calc(100vh - 7.5rem)';

  // Pagination properties
  currentLimit = 6;
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  carTypes: any = [];
  vehicleData: any = [];
  pagedCars: any[] = [];
  totolvehicle = 0;
  cartypeData: any = [];
  bodyData: any = [];
  brandData: any = [];
  modelData: any = [];
  bodyTypeData: any = [];
  selectedBodytype: any = [];
  selectedBrand: any = [];
  selectedModel: any = [];
  selectedCartype: any = [];
  selectedRentalType: any;
  minPrice: any = 0;
  maxPrice: any = 10000;
  price_type: any = '';
  filteredModel: any = [];
  availableStartDate: any;
  availableendDate: any;
  isFilterCollapsed = false;
  isMobileFilterVisible: boolean = false;
  vipNumberPlate: any = '';
  sort: any = '';
  param_type: any;
  vehicleType:any = 'Car';
  @ViewChild('minPriceInput') minPriceInput!: ElementRef;
  @ViewChild('maxPriceInput') maxPriceInput!: ElementRef;
  @ViewChild('rangeMin') rangeMin!: ElementRef;
  @ViewChildren('selctModel') selctModel: QueryList<ElementRef>;
  @ViewChildren('specialNumberSelect') specialNumberSelect: QueryList<ElementRef>;
  @ViewChildren('rentalTypeSelect') rentalTypeSelect: QueryList<ElementRef>;
  @ViewChild('rangeMax') rangeMax!: ElementRef;
  @ViewChild('filterContainer') filterRef!: ElementRef;
  @ViewChild('resultsSection') resultsRef!: ElementRef;

  constructor(
    private dataservice: DataService,
    private route: ActivatedRoute,
    private router: Router,
     @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize mobile filter as closed
    this.isMobileFilterVisible = false;
    this.param_type = this.route.snapshot.paramMap.get('type');
    if (this.param_type && this.param_type === 'vip') {
      this.vipNumberPlate = true;
    }
  }

  ngOnInit() {
    // Load initial data
    this.getBrands();
    this.getCarTypes();
    this.getModels();
    this.getBodyTypes();

    // Subscribe to query params
    this.route.queryParams.subscribe(params => {
      this.processQueryParams(params);
    });
  }

  ngAfterViewInit(): void {
    this.onScroll();
    this.initializeSlider();
  }

  initializeSlider() {
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
      this.updateSlider();

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
    const maxPos = parseFloat(maxThumb.style.left) || 0;
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
    this.maxPrice = Number(this.maxPrice) || 10000;

    // Ensure min and max are within bounds
    if (this.minPrice < 0) this.minPrice = 0;
    if (this.maxPrice > 10000) this.maxPrice = 10000;

    // Ensure minimum gap between min and max
    const minGap = 500;
    if (this.maxPrice - this.minPrice < minGap) {
      if (type === 'min') {
        this.maxPrice = this.minPrice + minGap;
        if (this.maxPrice > 10000) {
          this.maxPrice = 10000;
          this.minPrice = 10000 - minGap;
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
      window.scrollTo(0, 0);
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
      const filterTop = filter.getBoundingClientRect().top;
      const resultsBottom = results.getBoundingClientRect().bottom;

      if (resultsBottom <= filterHeight + filterTop) {
        filter.style.position = 'relative';
        filter.style.bottom = '0';
      } else {
        filter.style.position = 'sticky';
        filter.style.top = '11rem';
      }
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
  }

  resetFilter() {
    this.selectedBodytype = [];
    this.selectedBrand = [];
    this.selectedModel = [];
    this.selectedRentalType = null;
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.vipNumberPlate = false;
    this.sort = null;
    this.getCarData();
  }

  getCarData() {
    let obj = {
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
      startDate: this.availableStartDate,
      endDate: this.availableendDate,
      sort: this.sort,
      isvipNumberPlate: this.vipNumberPlate
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        this.totolvehicle = response.count;
        this.vehicleData = response.result;
        this.totalItems = response.count;
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          this.updatePagedCars();
        } else {
          this.vehicleData = [];
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
    let obj = {};
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.brandData = response.result;
        }
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
          this.bodyTypeData = response.result;
        }
      }
    });
  }

  changeBodyType(data) {
    if (data?.target?.value) {
      this.selectedBodytype = [data.target.value];
    }
  }

  changeBrand(data) {
    if (data?.target?.value) {
      this.selectedBrand = [data.target.value];
      this.selectedModel = []; // Reset model when brand changes
      if (this.modelData && this.modelData.length > 0) {
        this.filteredModel = this.modelData.filter((item) => item.brand === data.target.value);
      }
    }
  }

  changeModel(data) {
    if (data?.target?.value) {
      this.selectedModel = [data.target.value];
    }
  }

  changeCartype(data) {
    if (data?.target?.value) {
      this.selectedCartype = [data.target.value];
    }
  }

  changeRentalType(data) {
    if (data?.target?.value) {
      this.selectedRentalType = data.target.value;
      if (data.target.value === 'Daily') {
        this.price_type = 'dailyRate';
      } else if (data.target.value === 'Hourly') {
        this.price_type = 'hourlyRate';
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

  onChangevehicleType(data) {
    if (data?.target?.value) {
      this.vehicleType = data.target.value;
    } else {
      this.vehicleType = false;
    }
  }

  // UI Helpers
  toggleFilter(): void {
    if (window.innerWidth <= 768) {
      this.isMobileFilterVisible = !this.isMobileFilterVisible;
    } else {
      this.isFilterCollapsed = !this.isFilterCollapsed;
    }
  }

  // Alias for toggleFilter for mobile view
  openMobileFilter(): void {
    this.toggleFilter();
  }

}
