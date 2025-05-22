import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { LucideAngularModule, Star, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-angular';

@NgModule({
  declarations: [
    TestimonialsComponent
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({ Star, ChevronLeft, ChevronRight, Plus, Minus })
  ],
  exports: [
    TestimonialsComponent
  ]
})
export class SharedModule { }
