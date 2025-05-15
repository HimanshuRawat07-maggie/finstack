import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-export-modal',
  templateUrl: './import-export-modal.component.html',
  styleUrls: ['./import-export-modal.component.scss']
})
export class ImportExportModalComponent   {
   images = [
    { src: '../../../../assets/images/loading.png', alt: 'Image 1' },
    { src: '../../../../assets/images/auth.png', alt: 'Image 2' },
    { src: '../../../../assets/images/Logo_Spont_Software-witoutbackground.png', alt: 'Image 3' }
  ];
  currentSlide = 0;

  constructor(public dialogRef: MatDialogRef<ImportExportModalComponent>) { }
  
  close() {
    this.dialogRef.close();
  }

  prevSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.images.length - 1; 
    }
  }

  nextSlide() {
    if (this.currentSlide < this.images.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }
}
