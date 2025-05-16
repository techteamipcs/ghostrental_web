import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { LucideAngularModule, Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-angular';
import { SearchComponent } from './search/search.component';

@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    LucideAngularModule.pick({ Fuel, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight }),
  ]
})
export class ProductModule { }
