import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Unit } from 'chart.js/dist/scales/scale.time';
import { ToastrService } from 'ngx-toastr';
import { State } from 'src/app/core/api-models/company-model';
import { GstSlab, Item } from 'src/app/core/api-models/item-model';
import { Party } from 'src/app/core/api-models/party-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { SalePurchase } from 'src/app/core/models/sale-purchase-template';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';

@Component({
  selector: 'app-create-challan-out',
  templateUrl: './create-challan-out.component.html',
  styleUrls: ['./create-challan-out.component.scss']
})
export class CreateChallanOutComponent {
  public states: Array<State> = [];
  public parties: Array<Party> = [];
  public units: Array<Unit> = [];
  public taxSlabs: Array<GstSlab> = [];
  public items: Array<Item> = [];
  public selectedItemPriceType = 'WITHOUT_TAX';
  public order: SalePurchase;
  public prefix: string;
  public suffix: string;

  public editing: any = {};
  isSubmitDisabled: boolean = false;


  public constants = Constants;

  constructor(private companyService: CompanyService, private partyService: PartyService, private datePipe: DatePipe, private dialog: MatDialog,
    private itemService: ItemService, private saleService: SaleService, private router: Router, private route: ActivatedRoute, private toastr: ToastrService) {
    let dueDate = new Date();
    dueDate.setDate((new Date()).getDate() + 7);

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
      dueDate: this.datePipe.transform(dueDate, 'yyyy-MM-dd'),
      orderNumber: '',
      stateId: -1
    };
  }

  ngOnInit() {
    this.route.paramMap.subscribe(parameterMap => {
      let id = parameterMap.get('id');
       let type = parameterMap.get('type');
      if (type=='edit' && id != null) {
        const sub = this.saleService.getChallanOutById(parseInt(id)).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.prefix = this.order.orderPrefix;
          this.suffix = this.order.orderSuffix;
          sub.unsubscribe();
        });
      } else if (type == 'order' && id != null) {
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

          this.saleService.getLatestOrderNumber(this.constants.ChallanOut).subscribe(res => {
            this.order.orderNumber = res.data;
          });
          sub.unsubscribe();
        });
        
        const suff = this.companyService.getCompanySettingByKey('challanOut.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('challanOut.prefix').subscribe(res => {
          this.prefix = res.data;
          pref.unsubscribe();
        });

      }else {
        this.saleService.getLatestOrderNumber(this.constants.ChallanOut).subscribe(res => {
          this.order.orderNumber = res.data;
        });

        const suff = this.companyService.getCompanySettingByKey('challanOut.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('challanOut.prefix').subscribe(res => {
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
      const updateSub = this.saleService.updateChallanOut(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/challan-out');
          this.toastr.success('Data updated successfully');
          this.openPdf(parseInt(res.data), order.orderPrefix, order.orderNumber, order.orderSuffix);
        }
        else {
          this.toastr.error(res.message)
        }
        this.isSubmitDisabled = false;
        if (updateSub)
          updateSub.unsubscribe();
      });
    } else {
      const saveSub = this.saleService.saveChallanOut(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/challan-out');
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
            suffix: suffix
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
