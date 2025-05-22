import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { LucideAngularModule, Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, X } from 'lucide-angular';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    LucideAngularModule.pick({ Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight, X }),
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductModule { }
