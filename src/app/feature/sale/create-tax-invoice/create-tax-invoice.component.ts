import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { SalePurchase, SalePurchaseApiModel } from 'src/app/core/models/sale-purchase-template';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-tax-invoice',
  templateUrl: './create-tax-invoice.component.html',
  styleUrls: ['./create-tax-invoice.component.scss']
})
export class CreateTaxInvoiceComponent {
  public constants = Constants;
  public order: SalePurchase;
  public prefix: string;
  public suffix: string;
  isSubmitDisabled: boolean = false;

  constructor(private saleService: SaleService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe,
    private companyService: CompanyService, private toastr: ToastrService) {
    this.order = {
      partyId: -1,
      partyName: '',
      phone: '',
      email: '',
      items: [BusinessHelpers.initNewItem()],
      totalAmount: 0,
      totalAmountWithRoundOff: 0,
      advanceAmount: 0,
      balanceAmount: 0,

      hasReceivedAdvance: false,
      hasRoundOff: false,
      roundOff: 0,

      description: '',
      terms: '',
      refNumber: '',
      paymentMode: null,
      paymentDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),

      orderDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      orderNumber: '',
      stateId: -1
    };
  }

  ngOnInit() {
    this.route.paramMap.subscribe(parameterMap => {
      let id = parameterMap.get('id');
      let type = parameterMap.get('type');

      if (type == 'edit' && id != null) {
        const sub = this.saleService.getServiceInvoiceById(parseInt(id)).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.prefix = this.order.orderPrefix;
          this.suffix = this.order.orderSuffix;
          sub.unsubscribe();
        });
      } else if (type == 'order' && id!=null) {
        const sub = this.saleService.getSaleOrderById(parseInt(id)).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.id = -1;
          this.prefix = this.order.orderPrefix;
          this.suffix = this.order.orderSuffix;
          this.order.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          this.order.referenceId = parseInt(id);
          this.order.suppliersInvoiceDate = res.data.orderDate;
          this.order.suppliersInvoiceNumber = `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`;
          this.order.items.forEach(x => {
            x.id = null;
            x.taxName = '';
            x.taxPercent = 0;
          });

          this.saleService.getLatestOrderNumber(this.constants.Tax_Invoice).subscribe(res => {
            this.order.orderNumber = res.data;
          });
             const suff = this.companyService.getCompanySettingByKey('taxinvoice.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('taxinvoice.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });
          sub.unsubscribe();
        });
      } else if (type == 'challan' && id != null) {
        const sub = this.saleService.getSaleOrderById(parseInt(id)).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.id = -1;
          this.order.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
          this.order.referenceId = parseInt(id);
          this.order.suppliersInvoiceDate = res.data.orderDate;
          this.order.suppliersInvoiceNumber = `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`;
          this.order.items.forEach(x => {
            x.id = null;
          });

          this.saleService.getLatestOrderNumber(this.constants.Tax_Invoice).subscribe(res => {
            this.order.orderNumber = res.data;
          });
          sub.unsubscribe();
        });

        const suff = this.companyService.getCompanySettingByKey('taxinvoice.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('taxinvoice.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });

      }else if (type == 'create') {
        this.saleService.getLatestOrderNumber(this.constants.Tax_Invoice).subscribe(res => {
          this.order.orderNumber = res.data;
        });

        const suff = this.companyService.getCompanySettingByKey('taxinvoice.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('taxinvoice.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });
      }
    });
  }


  saveOrder(orderData: SalePurchase) {
    this.isSubmitDisabled = true;
    let order = BusinessHelpers.MapToApiModel(orderData);
    if (order.id && order.id > 0) {
      const updateSub = this.saleService.updateTaxInvoice(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/tax-invoice');
          this.toastr.success('Data updated successfully');
          this.openPdf(parseInt(res.data), order.orderPrefix, order.orderNumber, order.orderSuffix);
        } else {
          this.toastr.error(res.message)
        }
        this.isSubmitDisabled = false;
        if (updateSub)
          updateSub.unsubscribe();
      });
    }
    else {
      const saveSub = this.saleService.saveTaxInvoice(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/tax-invoice');
          this.toastr.success('Data saved successfully');
          this.openPdf(parseInt(res.data), order.orderPrefix, order.orderNumber, order.orderSuffix);
        } else {
          this.toastr.error(res.message)
        }
        this.isSubmitDisabled = false;
        if (saveSub)
          saveSub.unsubscribe();
      });
    }
  }

  pdfURL: SafeUrl;
  openPdf(id: number, prefix: string, orderNo: string, suffix: string) {
    this.saleService.processing(true);
    this.saleService.openPdf(id).subscribe({
      next: res => {
        this.saleService.processing(false);
        this.dialog.open(PdfModalComponent, {
          width: '95%',
          height: '95%',
          autoFocus: false,
          data: {
            res: res,
            prefix: prefix,
            orderNo: orderNo,
            suffix: suffix,
            id:id
          },
        });
      },
      error: err => {
        this.saleService.processing(false);
        this.toastr.error('Something went wrong. Please try after sometime');
      }
    });
  }

}
