import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  imageURL: string = `${environment.baseUrl}/assets`;
  isCar: boolean = true;
  today: string;
  maxDate: string;
  reservationForm!: FormGroup;
  

  carsCollections = [
    {
      name: 'BMW M3',
      image: 'collection/bmw_m3.png',
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
      image: 'collection/jeep_wrath.png',
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
      image: 'collection/lamborghini_huracan.png',
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
      image: 'collection/rolls_royce_wraith.png',
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
      image: 'collection/mclaren.png',
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

 

  carTypes = [
    { name: 'Convertible', image: 'convertible.png' },
    { name: 'Coupe', image: 'coupe.png' },
    { name: 'Hatch Back', image: 'hatch-back.png' },
    { name: 'Sedan', image: 'sedan.png' },
    { name: 'SUV', image: 'suv.png' },
    { name: 'Truck', image: 'truck.png' },
  ];

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

  getCarImageUrl(car: { image: string }): string {
    return `${this.imageURL}/cars/${car.image}`;
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
