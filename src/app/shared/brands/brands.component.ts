import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  @Input() title: string = 'explore our premium brands';
  @Input() titleClass: string = 'text-center size22 performa-light text-capitalize mb-5';
  @Input() buttonTitle: string = 'show all';
  imageURL: string = `${environment.baseUrl}/assets/brands`;
  brands = [
    { name: 'Bentley', imageUrl: `${this.imageURL}/bentley.png` },
    { name: 'BMW', imageUrl: `${this.imageURL}/bmw.png` },
    { name: 'Ferrari', imageUrl: `${this.imageURL}/ferrari.png` },
    { name: 'Land Rover', imageUrl: `${this.imageURL}/landrover.png` },
    { name: 'McLaren', imageUrl: `${this.imageURL}/mclaren.png` },
    { name: 'Mercedes', imageUrl: `${this.imageURL}/Mercedes.png` },
    { name: 'Porsche', imageUrl: `${this.imageURL}/porche.png` },
    { name: 'Rolls Royce', imageUrl: `${this.imageURL}/rolls_royce.png` }
  ];
}
