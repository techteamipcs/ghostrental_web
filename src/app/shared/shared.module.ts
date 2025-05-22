import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LucideAngularModule, Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-angular';
import { VipNumberPlateComponent } from './vip-number-plate/vip-number-plate.component';

@NgModule({
  declarations: [
    TestimonialsComponent,
    VipNumberPlateComponent
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ Star, ChevronLeft, ChevronRight, Plus, Minus })
  ],
  exports: [
    TestimonialsComponent,
    VipNumberPlateComponent
  ]
})
export class SharedModule { }
