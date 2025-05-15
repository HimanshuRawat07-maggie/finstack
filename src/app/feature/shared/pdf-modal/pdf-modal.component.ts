import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GetInvoiceTemplate as SaveInvoiceTemplate, InvoiceTemplates } from 'src/app/core/api-models/company-model';
import { CompanySettings } from 'src/app/core/api-models/company-setting.model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss']
})
export class PdfModalComponent implements OnInit {
  pdfURL: SafeUrl;
  color: string = '';
  templateId: number = null;
  public settings: CompanySettings = {};
  templates: Array<InvoiceTemplates> = [];
  constructor(public dialogRef: MatDialogRef<PdfModalComponent>, @Inject(MAT_DIALOG_DATA) public details: { res: Blob, prefix: string, orderNo: string, suffix: string,id:number,type:string },
    private sanitizer: DomSanitizer,private saleService:SaleService,private authService: AuthenticationService,private companyService:CompanyService,private toastr:ToastrService) { }

  ngOnInit() {
    this.authService.isBatchEnabled = this.settings['batch.enabled'] ?? 'false';  
    const hub = this.companyService.getInvoiceTemplates().subscribe(res => {
      this.templates = res.data;
      const invoice = this.companyService.getCompanyInvoiceTheme().subscribe(res => {
        let theme = res.data;
        if (theme && theme.colorCode) {
          this.color = theme.colorCode;
        }
        invoice.unsubscribe();
      });
      hub.unsubscribe();
    });
    this.loadPdf();
  }

  changePdf(id: number, color: string) {        
    this.templateId = id;
    let colorCode = encodeURIComponent(color);
    const sub =this.saleService.openPdf(this.details.id,id,colorCode).subscribe(res => {
      this.details.res = res;
      this.loadPdf();
      sub.unsubscribe();
    });
  }

  openColorInput() {
    document.getElementById('color').click()
  }


  loadPdf() {
    var file = new Blob([this.details.res], { type: 'application/pdf' });
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const [_, base64] = dataUrl.toString().split(',');
      const pdfAsDataUri = "data:application/pdf;base64," + base64;
      this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl(pdfAsDataUri);
    };
    reader.readAsDataURL(file);
  }

  openChooseColor() {
    document.getElementById('color').click();
  }

  download() { 
    let anchorElement = document.createElement("a");
    document.body.appendChild(anchorElement);
    let file = new Blob([this.details.res], { type: 'application/pdf' });
    let objectURL = URL.createObjectURL(file);

    anchorElement.href = objectURL;
    anchorElement.download = `${this.details.prefix}${this.details.orderNo}${this.details.suffix}.pdf`;
    anchorElement.click();
    document.body.removeChild(anchorElement);
  }

  close() {
    this.dialogRef.close(true);
  }

  setDefault() {
    let invoice: SaveInvoiceTemplate = {
      themeId: this.templateId,
      colorCode: this.color
    }
    const theme = this.companyService.saveCompanyInvoiceTheme(invoice).subscribe(res => {
      if (res.code == 200) {
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
      theme.unsubscribe();
    })
  }
}
