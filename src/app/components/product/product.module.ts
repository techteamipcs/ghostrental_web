import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { LucideAngularModule, Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-angular';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    LucideAngularModule.pick({ Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight }),
  ]
})
export class ProductModule { }
