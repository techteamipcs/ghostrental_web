import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  // Make Math available in template
  Math = Math;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 16;
  totalItems = 0;
  pagedCars: any[] = [];
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
    },
  ];

  ngOnInit() {
    this.updatePagedCars();
  }

  get totalPages(): number {
    return Math.ceil(this.carsCollections.length / this.itemsPerPage);
  }

  updatePagedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedCars = this.carsCollections.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalItems = this.carsCollections.length;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagedCars();
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
}
