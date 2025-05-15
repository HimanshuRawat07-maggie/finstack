import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { State } from 'src/app/core/api-models/company-model';
import { Unit, GstSlab, Item } from 'src/app/core/api-models/item-model';
import { Party } from 'src/app/core/api-models/party-model';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { SalePurchase, SalePurchaseApiModel } from 'src/app/core/models/sale-purchase-template';
import { PdfModalComponent } from '../../shared/pdf-modal/pdf-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-sale-order',
  templateUrl: './create-sale-order.component.html',
  styleUrls: ['./create-sale-order.component.scss']
})
export class CreateSaleOrderComponent {
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
      if (id != null) {
        const sub = this.saleService.getSaleOrderById(parseInt(id)).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.prefix = this.order.orderPrefix;
          this.suffix = this.order.orderSuffix;
          sub.unsubscribe();
        });
      } else {
        this.saleService.getLatestOrderNumber(this.constants.SaleOrder).subscribe(res => {
          this.order.orderNumber = res.data;
        });

        const suff = this.companyService.getCompanySettingByKey('saleOrder.suffix').subscribe(res => {
          this.suffix = res.data;
          suff.unsubscribe();
        });
        const pref = this.companyService.getCompanySettingByKey('saleOrder.prefix').subscribe(res => {
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
      const updateSub = this.saleService.updateSalesOrder(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/order');
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
      const saveSub = this.saleService.saveSalesOrder(order).subscribe(res => {
        if (res.code === 200) {
          this.router.navigateByUrl('/app/sale/order');
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
