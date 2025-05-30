import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ElementRef
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../providers/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  // Pagination properties
  currentLimit = 7;
  currentPage = 1;
  itemsPerPage = 7;
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
  vipNumberPlate: any='';
  sort: any = '';
  param_type: any;
  @ViewChild('minPriceInput') minPriceInput!: ElementRef;
  @ViewChild('maxPriceInput') maxPriceInput!: ElementRef;
  @ViewChild('rangeMin') rangeMin!: ElementRef;
  @ViewChild('rangeMax') rangeMax!: ElementRef;
  @ViewChild('filterContainer') filterRef!: ElementRef;
  @ViewChild('resultsSection') resultsRef!: ElementRef;

  constructor(
    private dataservice: DataService,
    public router: ActivatedRoute
  ) {
    // Initialize mobile filter as closed
    this.isMobileFilterVisible = false;
    this.param_type = this.router.snapshot.paramMap.get('type');
    if(this.param_type && this.param_type == 'vip'){
      this.vipNumberPlate = true;
    }
  }

  ngOnInit() {
    this.getCarData();
    this.getBrands();
    this.getCarTypes();
    this.getModels();
    this.getBodyTypes();
  }

  ngAfterViewInit(): void {
    this.onScroll();

    const minInput = this.minPriceInput.nativeElement;
    const maxInput = this.maxPriceInput.nativeElement;
    const rangeMinEl = this.rangeMin.nativeElement;
    const rangeMaxEl = this.rangeMax.nativeElement;

    this.updateSlider(); // initialize

    // Sync range sliders
    rangeMinEl.addEventListener('input', () => {
      let min = parseInt(rangeMinEl.value);
      let max = parseInt(rangeMaxEl.value);
      if (min > max - 500) {
        min = max - 500;
        rangeMinEl.value = min;
      }
      minInput.value = min;
      this.minPrice = min;
      this.updateSlider();
    });

    rangeMaxEl.addEventListener('input', () => {
      let min = parseInt(rangeMinEl.value);
      let max = parseInt(rangeMaxEl.value);
      if (max < min + 500) {
        max = min + 500;
        rangeMaxEl.value = max;
      }
      maxInput.value = max;
      this.maxPrice = max;
      this.updateSlider();
    });

    // Sync number inputs
    minInput.addEventListener('input', () => {
      let min = parseInt(minInput.value) || 0;
      let max = parseInt(maxInput.value) || 0;
      if (min < 0) min = 0;
      if (min > max - 500) min = max - 500;
      rangeMinEl.value = min;
      this.minPrice = min;
      this.updateSlider();
    });

    maxInput.addEventListener('input', () => {
      let min = parseInt(minInput.value) || 0;
      let max = parseInt(maxInput.value) || 0;
      if (max < min + 500) max = min + 500;
      rangeMaxEl.value = max;
      this.maxPrice = max;
      this.updateSlider();
    });
  }



  updateSlider() {
    const rangeMinEl = this.rangeMin.nativeElement;
    const rangeMaxEl = this.rangeMax.nativeElement;
    const sliderRange = document.getElementById('slider-range');

    const min = parseInt(rangeMinEl.value);
    const max = parseInt(rangeMaxEl.value);
    const maxLimit = parseInt(rangeMinEl.max);

    const percentMin = (min / maxLimit) * 100;
    const percentMax = (max / maxLimit) * 100;

    if (sliderRange) {
      sliderRange.style.left = percentMin + '%';
      sliderRange.style.width = (percentMax - percentMin) + '%';
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

  SearchItems() {
    this.getCarData();
  }

  getCarData() {
    let obj = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: "Car",
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
        if (response.result && response.result.length > 0) {
          this.totolvehicle = response.count;
          this.vehicleData = response.result;
          this.totalItems = response.count;
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
    if (data) {
      this.selectedBodytype.push(data.target.value);
    }
  }

  changeBrand(data) {
    if (data) {
      this.selectedBrand.push(data.target.value);
      if (this.modelData && this.modelData.length > 0) {
        this.filteredModel = this.modelData.filter((item) => item.brand == data.target.value)
      }
    }
  }

  changeModel(data) {
    if (data) {
      this.selectedModel.push(data.target.value);
    }
  }

  changeCartype(data) {
    if (data) {
      this.selectedCartype.push(data.target.value);
    }
  }

  changeRentalType(data) {
    if (data) {
      this.selectedRentalType = data.target.value;
      if (data.target.value == 'Daily') {
        this.price_type = 'dailyRate';
      } else if (data.target.value == 'Hourly') {
        this.price_type = 'hourlyRate';
      } else if (data.target.value == 'Weekly') {
        this.price_type = 'weeklyRate';
      } else if (data.target.value == 'Monthly') {
        this.price_type = 'monthlyRate';
      }
    }
  }

  onChangeSort(data) {
     if (data) {
      this.sort = data.target.value;
      this.getCarData();
     }
  }

  onChangeSpecialNumber(data) {
     if (data) {
      this.vipNumberPlate = data.target.value =='true'? true : false;
      // this.getCarData();
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
