import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../components/loader/loader.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent] // Export LoaderComponent for other modules
})
export class SharedModule { }
