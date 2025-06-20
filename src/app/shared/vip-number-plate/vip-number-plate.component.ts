import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-vip-number-plate',
  templateUrl: './vip-number-plate.component.html',
  styleUrl: './vip-number-plate.component.scss'
})
export class VipNumberPlateComponent {

  imageURL: string = `${environment.url}/assets`;
  backendURL: string = `${environment.baseUrl}/public`;

 
}
