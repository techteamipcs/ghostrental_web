import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
// Make Math available in template
  Math = Math;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;

  // Pagination properties
  currentLimit = 8;
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totolvehicle = 0;
  pagedCars: any = [];
  vehicleData: any = [];
  ourCarCollections: any = [];
  trendingRentalCars: any = [];
  bannerData: any;
  cartypeData: any;
  url_key:any;
  carTypes: any = [];
  vehicle_type:any;
  selectedbannerpage = 'product';
  selectedBodytype:any;
  selectedBrand:any;
  selectedModel:any;
  pickuplocation:any;
  droplocation:any;
  availableStartDate:any;
  availableendDate:any;
  listBodytype: any = [];
  filteredBodytype: any = [];
  listModels: any = [];
  filteredModels: any = [];
  listBrands: any = [];
  filteredBrands: any = [];
  locationData: any = [];
  filterPickupLocation: any = [];
  filterDropLocation: any = [];
  sort:any;
  constructor(
    private dataservice: DataService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.url_key = this.route.snapshot.paramMap.get('car_type');
  }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.vehicle_type = params['vehicle'];
      this.selectedBodytype = params['body_type'];
      this.selectedBrand = params['brand'];
      this.selectedModel = params['model'];
      this.pickuplocation = params['pick_address'];
      this.droplocation = params['drop_address'];
      this.availableStartDate = params['startDate'];
      this.availableendDate = params['endDate'];
    });
    this.getBodyTypes();
    this.getModels();
    this.getBrands();
    this.getLocations();
    if(this.url_key){
      this.getCarTypes();
    } else {
      this.getCarData();
    }    
    this.getBannerData();
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
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBodytype = response.result;
          if (this.listBodytype && this.listBodytype.length > 0) {
            let temp = this.listBodytype.filter((bodytype) => bodytype.url_key == this.selectedBodytype);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredBodytype.push(temp[0]._id);
            }
            this.getCarData();
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
            let temp = this.listModels.filter((bodytype) => bodytype.url_key == this.selectedModel);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredModels.push(temp[0]._id);
            }
            this.getCarData();
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
            let temp = this.listBrands.filter((bodytype) => bodytype.url_key == this.selectedBrand);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredBrands.push(temp[0]._id);
            }
            this.getCarData();
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
          if (this.locationData && this.locationData.length > 0) {
            let temp = this.locationData.filter((location) => location.name == this.pickuplocation);
            if(temp && temp.length > 0 && temp[0] && this.pickuplocation){
              this.filterPickupLocation.push({ _id:temp[0]._id,name: temp[0].name});
            }
            temp = this.locationData.filter((location) => location.name == this.droplocation);
            if(temp && temp.length > 0 && temp[0] && this.droplocation){
              this.filterDropLocation.push({ _id:temp[0]._id,name: temp[0].name});
            }
            this.getCarData();
          }
        }
      }
    });
  }
  

  getCarData() {
    let obj = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: this.vehicle_type,
      car_type : this.carTypes,
      bodyTypeId: this.filteredBodytype,
      brandId: this.filteredBrands,
      modelId:this.filteredModels,
      startDate: this.availableStartDate,
      endDate: this.availableendDate,
      sort: this.sort,
      pickuplocation: this.filterPickupLocation,
      droplocation: this.filterDropLocation
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        this.totolvehicle = response.count;          
        this.totalItems = response.count;
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          this.updatePagedCars();
        } else{
          this.totolvehicle = 0;
          this.vehicleData = [];
          this.totalItems = 0;
        }
      }
    });
  }

  onChangeSort(data) {
     if (data) {
      this.sort = data.target.value;
      this.getCarData();
     }
  }

  getBannerData(){
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          response.result.forEach(banner => {
            if(banner && banner.status && banner.page == this.selectedbannerpage){
              this.bannerData = banner;
            }
          });        
        }
      }
    });
  }

  getCarTypes(){
    let obj = {
      url_key : this.url_key
    };
    this.dataservice.getCarTypeByURL(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          this.cartypeData = response.result[0];
          if(this.cartypeData){
            this.carTypes.push(this.cartypeData._id);
            this.selectedbannerpage = this.cartypeData.name;
            this.getCarData();
            this.getBannerData();
          }          
        }
      }
    });
  }
}
