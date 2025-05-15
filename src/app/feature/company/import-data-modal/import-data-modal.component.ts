import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ReportService } from 'src/app/core/api-services/report/report.service';
import { ApiUrl } from 'src/app/core/constants/api-url-constant';

@Component({
  selector: 'app-import-data-modal',
  templateUrl: './import-data-modal.component.html',
  styleUrls: ['./import-data-modal.component.scss']
})
export class ImportDataModalComponent implements OnInit {
  file: File;
  isExportEnable = false;

  master: File;
  voucher: File;
  isVoucherEnable = false;
  isFirstStepVisible = true;
  isMasterFormVisible = true;
  isVoucherFormVisible = true;
  isMasterErrorVisible = false;
  isVoucherErrorVisible = false;


 @ViewChild('masterForm') masterForm?: any;
 @ViewChild('voucherForm') voucherForm?: any;
  constructor(public dialogRef: MatDialogRef<ImportDataModalComponent>, private companyService: CompanyService,
    private toastr: ToastrService,private reportService:ReportService) { }

  ngOnInit() {

  }

  cancel() {
    this.dialogRef.close(true);
  }

  // onFileChange(e: any) {
  //   this.file = e.target.files[0];
  // }

  onMasterChange(e: any) {
    this.master = e.target.files[0];
    this.isMasterErrorVisible = false;    
  }

  onVoucherChange(e: any) {
    this.voucher = e.target.files[0];
    this.isVoucherErrorVisible = false;
  }

  // onSubmit() {
  //   let formData: any = new FormData();
   
    
  //   if (!this.isVoucherEnable) {
  //      formData.append('master', this.file);
  //     const sub = this.companyService.importMasterData(formData).subscribe(res => {
  //       if (res.code == 200) {
  //         this.toastr.success(res.message);
  //         this.cancel();
  //       }
  //       else {
  //         this.toastr.error(res.message);
  //       }
  //     });
  //   } else {
  //      formData.append('voucher', this.file);
  //       const sub = this.companyService.importVoucherData(formData).subscribe(res => {
  //         if (res.code == 200) {
  //           this.toastr.success(res.message);
  //           this.cancel();
  //         }
  //         else {
  //           this.toastr.error(res.message);
  //         }
  //     });
  //   }
  // }

  goBack() {
    this.isFirstStepVisible = true;
  }

  onFilePicker(id:string) {
    document.getElementById(id)?.click();
  }

  onSubmit(page: string) {
    if (page == 'master') {
      if (this.master==null||undefined) {
        this.isMasterErrorVisible = true;
      } else {
        this.isFirstStepVisible = false;
      }
    } else {
      if (this.voucher==null||undefined) {
        // this.isVoucherErrorVisible = true;
      }
    }
   
    if (!this.isMasterErrorVisible && !this.isVoucherEnable&& page=='voucher') {
      let masterFormData: any = new FormData();  
      let voucherFormData: any = new FormData(); 
      masterFormData.append('master', this.master);
      voucherFormData.append('voucher', this.voucher);
      const master = this.companyService.importMasterData(masterFormData).subscribe(res => {
        if (res.code == 200) {
          this.toastr.success('Master data saved successfully');
          master.unsubscribe();
          const voucher = this.companyService.importVoucherData(voucherFormData).subscribe(res => {
            if (res.code == 200) {
              this.toastr.success('Voucher data saved successfully');
              this.cancel();
            }
            else {
              this.toastr.error(res.message);
            }
            voucher.unsubscribe();
          });
          // this.cancel();
        }
        else {
          this.toastr.error(res.message);
          master.unsubscribe();
        }
      });
    }
  }

download() {
    this.reportService.processing(true);
    let url = ApiUrl.exportVoucher
    this.reportService.downloadReport(url).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Voucher.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });


    this.reportService.processing(true);
    let urls = ApiUrl.exportMaster
    this.reportService.downloadReport(urls).subscribe(res => {
      let anchorElement = document.createElement("a");
      document.body.appendChild(anchorElement);
      let file = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      let objectURL = URL.createObjectURL(file);

      anchorElement.href = objectURL;
      anchorElement.download = 'Master.xlsx';
      anchorElement.click();
      document.body.removeChild(anchorElement);
      this.reportService.processing(false);
    });
  }

  downloadSampleReport(type:string) {
    
  }
}