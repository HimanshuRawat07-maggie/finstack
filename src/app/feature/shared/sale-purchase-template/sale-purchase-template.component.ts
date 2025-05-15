import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Bank } from 'src/app/core/api-models/bank-model';
import { State, getCompanyDetails, signature } from 'src/app/core/api-models/company-model';
import { Unit, GstSlab, ItemWithDetails } from 'src/app/core/api-models/item-model';
import { Party } from 'src/app/core/api-models/party-model';
import { BankService } from 'src/app/core/api-services/bank/bank.service';
import { CompanyService } from 'src/app/core/api-services/company/company.service';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { PartyService } from 'src/app/core/api-services/party/party.service';
import { Constants } from 'src/app/core/constants/app-constant';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { SalePurchase } from 'src/app/core/models/sale-purchase-template';
import { SalePurchaseBatchModelComponent } from '../sale-purchase-batch-model/sale-purchase-batch-model.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Location } from '@angular/common';
import { AppEvents } from 'src/app/core/models/appenums';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { SaleService } from 'src/app/core/api-services/sale/sale.service';
import { PurchaseService } from 'src/app/core/api-services/purchase/purchase.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AddPartyComponent } from '../../party/add-party/add-party.component';
import { AddEditItemComponent } from '../../item/add-edit-item/add-edit-item.component';
import { DispatchExportDetailsModalComponent } from '../dispatch-export-details-modal/dispatch-export-details-modal.component';
import { ExpenseService } from 'src/app/core/api-services/expense/expense.service';
import { Ledger } from 'src/app/core/api-models/expense-model';
// import { BarcodeScanComponent } from '../../item/barcode-scan/barcode-scan.component';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';

@Component({
  selector: 'app-sale-purchase-template',
  templateUrl: './sale-purchase-template.component.html',
  styleUrls: ['./sale-purchase-template.component.scss']
})
export class SalePurchaseTemplateComponent {
  public constants = Constants;
  public states: Array<State> = [];
  public parties: Array<Party> = [];
  public filteredParties: Array<Party> = [];
  public units: Array<Unit> = [];
  public taxSlabs: Array<GstSlab> = [];
  public items: Array<ItemWithDetails> = [];
  public filteredItems: Array<ItemWithDetails> = [];
  public selectedItemPriceType = this.constants.WITHOUT_TAX;
  public editingIdx: number = -1;
  public isPartyDropdownOpen = false;
  public isItemDropdownOpen = false;
  public isSignDropdownOpen = false;
  public paymentTypes: Array<Bank> = [];
  public pendingOrders: Array<any> = [];
  public pendingLabel: string = '';
  public currentCompany: getCompanyDetails;
  public isWarehouseEnabled = false;
  public isBatchEnabled = false;
  public isDiscountEnabled = false;
  public itemColWidth = '15%';
  public cashOrBank: string = '';
  public expenseLedgers: Array<Ledger>;
  public filteredExpenseLedgers: Array<Ledger>;
  public ledgers: Array<Ledger>;
  public filteredLedgers: Array<Ledger>;
  public signatures: Array<signature> = [];
  public selectedSignature: string;

  @Input() prefix: string;
  @Input() suffix: string;

  @Input() pageTitle: string = '';
  @Input() formType: string = '';
  @Output() saveOrder = new EventEmitter<SalePurchase>();
  @Output() submitButton = new EventEmitter<boolean>();


  @Input() isSubmitButtonDisable:boolean;
  @Input() order: SalePurchase;
  public uiPlaceholders = {
    orderNumber: '',
    orderDate: '',
    party: '',
    receivedPaid: '',
    supplierInvoiceNumber: '',
    supplierDate: '',
    isPartyDropdownVisible: true,
    isDueDateVisible: false,
    isSupplierInvoiceNumberVisible: false,
    isSupplierDateVisible: false,
    isCustomerNameVisible: false,
    isServiceInvoice: false,
    isAdvanceVisible: true,
    isDispatchExportDetailsVisible: true
  };
  minDate: string = '';
  warehouses: Array<Warehouse> = [];
  terms: string = '';
  @Input('isSubmitDisabled') isSubmitDisabled : boolean;

  constructor(private companyService: CompanyService, private partyService: PartyService, private dialog: MatDialog,
    private itemService: ItemService, private bankService: BankService, private itemGroupService: ItemGroupService,
    private location: Location, private appStateService: AppStateService, private saleService: SaleService,
    private purchaseService: PurchaseService, private datePipe: DatePipe, private authService: AuthenticationService,
    private toastr: ToastrService, private expenseService: ExpenseService,private warehouseService:WarehouseService) { }

  ngOnInit() {
     this.minDate = localStorage.getItem('minDate');
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    this.isDiscountEnabled = this.authService.isDiscountEnabled == 'true';
    if (!this.isBatchEnabled && !this.isWarehouseEnabled && !this.isDiscountEnabled)
      this.itemColWidth = '50%';
    else if (!this.isBatchEnabled && !this.isWarehouseEnabled && this.isDiscountEnabled)
      this.itemColWidth = '40%';
    else if (this.isBatchEnabled && this.isWarehouseEnabled && !this.isDiscountEnabled)
      this.itemColWidth = '20%';
    
    const ware = this.warehouseService.getAllWarehouses().subscribe(res => {
      this.warehouses = res.data;
    })
      
    this.appStateService.sendEvent(AppEvents.SidebarToggle, true);
    this.appStateService.currentCompany().subscribe(res => { this.currentCompany = res; });
    this.companyService.getAllStates().subscribe(states => {
      this.states = states.data;
      if (this.states?.length > 0)
        this.states.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
    });

    const signSub = this.companyService.getCompanyDetailsById().subscribe(res => {
      this.signatures = res?.data?.signature ?? [];
      this.terms = res?.data?.terms ?? '';
      signSub.unsubscribe();
    });

    this.partyService.getAllParties().subscribe(parties => {
      this.parties = parties.data;
      this.filteredParties = [...this.parties];
    });

    this.itemService.getAllUnit().subscribe(units => {
      this.units = units.data;
    });

    this.itemService.getAllSlab().subscribe(taxes => {
      this.taxSlabs = taxes.data;
    });

    this.bankService.getAllBankDetails().subscribe(paymentTypes => {
      this.paymentTypes = paymentTypes.data;
      if (this.paymentTypes?.length > 0)
        this.paymentTypes.sort((a, b) => {
          if (a.accountDisplayName!?.toLowerCase() < b.accountDisplayName!?.toLowerCase()) { return -1; }
          if (a.accountDisplayName!?.toLowerCase() > b.accountDisplayName!?.toLowerCase()) { return 1; }
          return 0;
        });
    });
    const sub = this.expenseService.getAllExpenseLedgers().subscribe(res => {
      this.expenseLedgers = res.data;
      this.expenseLedgers.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      this.filteredExpenseLedgers = [...this.expenseLedgers];
      const led = this.expenseService.getAllLedger().subscribe(res => {
        this.ledgers = res.data;
        let getExpenseLedgerIds = this.filteredExpenseLedgers.map(obj => obj.id);
        this.ledgers = this.ledgers.filter(obj => !getExpenseLedgerIds.includes(obj.id));
        this.ledgers.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
        this.filteredLedgers = [...this.ledgers];

      })
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formType']) {
      switch (this.formType) {
        case Constants.SaleOrder:
        case Constants.ChallanIn:
        case Constants.ChallanOut:
          this.uiPlaceholders = {
            orderNumber: 'Order Number',
            orderDate: 'Order Date',
            party: 'Party',
            receivedPaid: 'Advance Amount',
            supplierInvoiceNumber: '',
            supplierDate: '',
            isPartyDropdownVisible: true,
            isDueDateVisible: true,
            isSupplierDateVisible: false,
            isSupplierInvoiceNumberVisible: false,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: false,
            isDispatchExportDetailsVisible: true
          };
          break;

        case Constants.Sale:
        case Constants.Tax_Invoice:
        case Constants.Pos:
        case Constants.Service_Invoice:
          this.uiPlaceholders = {
            orderNumber: 'Invoice Number',
            orderDate: 'Invoice Date',
            party: 'Customer',
            receivedPaid: 'Received',
            supplierInvoiceNumber: '',
            supplierDate: '',
            isPartyDropdownVisible: true,
            isDueDateVisible: false,
            isSupplierDateVisible: false,
            isSupplierInvoiceNumberVisible: false,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: true,
            isDispatchExportDetailsVisible: true
          };
          break;

        case Constants.SaleReturn:
          this.uiPlaceholders = {
            orderNumber: 'Return Number',
            orderDate: 'Return Date',
            party: 'Party',
            receivedPaid: 'Paid Amount',
            supplierInvoiceNumber: 'Invoice Number',
            supplierDate: 'Invoice Date',
            isPartyDropdownVisible: true,
            isDueDateVisible: false,
            isSupplierDateVisible: true,
            isSupplierInvoiceNumberVisible: false,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: true,
            isDispatchExportDetailsVisible: true
          };
          break;

        case Constants.PurchaseOrder:
          this.uiPlaceholders = {
            orderNumber: 'Order Number',
            orderDate: 'Order Date',
            party: 'Party',
            receivedPaid: 'Advance Amount',
            supplierInvoiceNumber: '',
            supplierDate: '',
            isPartyDropdownVisible: true,
            isDueDateVisible: true,
            isSupplierDateVisible: false,
            isSupplierInvoiceNumberVisible: false,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: false,
            isDispatchExportDetailsVisible: false
          };
          break;

        case Constants.Purchase:
          this.uiPlaceholders = {
            orderNumber: 'Bill Number',
            orderDate: 'Bill Date',
            party: 'Party',
            receivedPaid: 'Paid',
            supplierInvoiceNumber: 'Supplier\'s Invoice Number',
            supplierDate: 'Supplier\'s Invoice Date',
            isPartyDropdownVisible: true,
            isDueDateVisible: false,
            isSupplierDateVisible: true,
            isSupplierInvoiceNumberVisible: true,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: true,
            isDispatchExportDetailsVisible: false
          };
          break;

        case Constants.PurchaseReturn:
          this.uiPlaceholders = {
            orderNumber: 'Return Number',
            orderDate: 'Return Date',
            party: 'Party',
            receivedPaid: 'Recieved Amount',
            supplierInvoiceNumber: 'Bill Number',
            supplierDate: 'Bill Date',
            isPartyDropdownVisible: true,
            isDueDateVisible: false,
            isSupplierDateVisible: true,
            isSupplierInvoiceNumberVisible: false,
            isCustomerNameVisible: false,
            isServiceInvoice: false,
            isAdvanceVisible: true,
            isDispatchExportDetailsVisible: false
          };
          break;
      }

      if (this.formType === Constants.Pos) {
        this.uiPlaceholders.isPartyDropdownVisible = false;
        this.uiPlaceholders.isCustomerNameVisible = true;
      }

      if (this.formType === Constants.Service_Invoice) {
        this.uiPlaceholders.isServiceInvoice = true;
        this.uiPlaceholders.isDispatchExportDetailsVisible = false;
      }

      this.itemService.getAllItemsWithDetails().subscribe(items => {
        this.items = items.data;
        if (this.items?.length > 0)
          this.items.sort((a, b) => {
            if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
            if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
            return 0;
          });

        if (this.formType == Constants.Service_Invoice) {
          this.items = this.items.filter(x => x.type === 'Service');
        }
        if (this.items?.length > 0)
          this.filteredItems = [...this.items];
        else
          this.filteredItems = [];
      });
    }

    if (changes['order'] && (this.order?.id > 0 && (this.order?.items?.length > 0 || this.order?.ledgers?.length > 0)) ||
      (this.order?.id == -1 && (this.order?.items?.length > 0 || this.order?.ledgers?.length > 0))) {
      if (this.order.id == -1)
        this.order.id = null;
      if (this.order.paymentMode != null) {
        if (this.order.paymentMode === 'CASH') {
          this.cashOrBank = this.constants.Cash;
        } else {
          this.cashOrBank = this.constants.Bank;
        }
      }
      this.order.items = [...this.order.items, ...this.order.ledgers];
      const data = this.expenseService.getAllExpenseLedgers().subscribe(res => {
        this.expenseLedgers = res.data;
        this.expenseLedgers.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
        this.filteredExpenseLedgers = [...this.expenseLedgers];
        const led = this.expenseService.getAllLedger().subscribe(res => {
          this.ledgers = res.data;
          let getExpenseLedgerIds = this.filteredExpenseLedgers.map(obj => obj.id);
          this.ledgers = this.ledgers.filter(obj => !getExpenseLedgerIds.includes(obj.id));
          this.ledgers.sort((a, b) => {
            if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
            if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
            return 0;
          });
          this.filteredLedgers = [...this.ledgers];

          let filteredLedgerFromLedgerAndExpense = this.filteredLedgers.map(obj => obj.name);
          this.order.items.forEach(obj => {
            if (filteredLedgerFromLedgerAndExpense.includes(obj.name)) {
              obj.type = this.constants.OtherLedger;
            }
          });
        })
        data.unsubscribe();
      });


      const sub = this.itemService.getAllSlab().subscribe(res => {
        this.selectedItemPriceType = this.order.hasTax ? this.constants.WITH_TAX : this.constants.WITHOUT_TAX;
        let taxSlabs = res.data;
        if (taxSlabs) {
          this.order.items.forEach(item => {
            let taxSlab = taxSlabs.find(x => x.id == item.taxId);
            if (taxSlab) {
              item.taxName = taxSlab.name!;
              item.taxPercent = taxSlab.valueInPercent!;
            }
          });
        }
        this.order.totalAmount = this.getTotalAmount();
        this.setSignature(this.order.signatureId);
        sub.unsubscribe();
      });
    }
  }

  addRow() {
    this.order.items.push(BusinessHelpers.initNewItem());
  }

  removeRow(idx: number) {
    this.order.items.splice(idx, 1);
    this.order.totalAmountWithRoundOff = this.getTotalAmount();
    this.order.totalAmount = this.getTotalAmount();
     this.order.amountInWords = BusinessHelpers.numberToWords(this.order.totalAmount.toString());
    this.updateBalanceAmount();
  }

  selectParty(party: Party) {
    if (party.name) {
      this.order.partyName = party.name;
      this.order.billingAddress = party.gstState ?? '';
      this.order.phone = party.phone;
    }
    this.filterParty();
    this.isPartyDropdownOpen = false;
    this.pendingOrders = [];

    this.partyService.getPartyById(party.id).subscribe(res => {
      let partyRes = res.data;
      this.order.billingAddress = partyRes.billingAddress?.address ?? '';
      this.order.billingAddress2 = partyRes.billingAddress?.address2 ?? '';
      this.order.billingStateId = partyRes.billingAddress?.state?.id ?? null;
      this.order.billingPincode = partyRes.billingAddress?.pincode ?? '';
      this.order.phone = partyRes.phone ?? '';
      this.order.billingStateId = partyRes.gstStateId;
    });

    this.order.referenceId = null;
    this.order.suppliersInvoiceDate = null;
    this.order.suppliersInvoiceNumber = null;

    if (this.formType === this.constants.Sale || this.formType === this.constants.Tax_Invoice || this.formType === this.constants.Service_Invoice || this.formType===this.constants.ChallanOut) {
      this.saleService.getPendingSaleOrderByPartyId(party.id,(this.formType==this.constants.ChallanOut?false:true)).subscribe(res => {
        if (res?.data?.length > 0) {
          if (this.formType===this.constants.ChallanOut) {
            this.pendingLabel = 'Pending Sale Orders';
          } else {
            this.pendingLabel = 'Pending Sale Orders/Challan';
          }
          this.pendingOrders = [...res.data];
        }
      });
    } else if (this.formType === this.constants.SaleReturn) {
      this.saleService.getCompletedSaleByPartyId(party.id).subscribe(res => {
        if (res?.data?.length > 0) {
          this.pendingLabel = 'Return Against';
          this.pendingOrders = [...res.data];
        }
      });
    } else if (this.formType === this.constants.Purchase && this.formType===this.constants.ChallanIn) {
      this.purchaseService.getPendingPurchaseOrderByPartyId(party.id,(this.formType==this.constants.ChallanIn?false:true)).subscribe(res => {
        if (res?.data?.length > 0) {
          if (this.formType === this.constants.ChallanIn) {
            this.pendingLabel = 'Pending Purchase Order';
          } else {
            this.pendingLabel = 'Pending Purchase Order/Challan';
          }
          this.pendingOrders = [...res.data];
        }
      });
    } else if (this.formType === this.constants.PurchaseReturn) {
      this.purchaseService.getCompletedPurchaseByPartyId(party.id).subscribe(res => {
        if (res?.data?.length > 0) {
          this.pendingLabel = 'Return Against';
          this.pendingOrders = [...res.data];
        }
      });
    }
  }

  filterParty() {
    this.isPartyDropdownOpen = true;
    if (this.order?.partyName?.length > 0)      
      this.filteredParties = this.parties.filter(x =>
        x.name?.toLowerCase().includes(this.order.partyName.toLowerCase()) ||
        x.alias?.toLowerCase().includes(this.order.partyName.toLowerCase()) ||
        (x.phone && x.phone?.toLowerCase().includes(this.order.partyName.toLowerCase())));
    else
      this.filteredParties = [...this.parties];
  }

  // setItem(idx:number) {
  //     let dialogRef = this.dialog.open(BarcodeScanComponent, {
  //     width: '30%',
  //     autoFocus: false,
  //       data: {
  //       type:'transaction'
  //     },
  //   });

  //   dialogRef.componentInstance.confirmed.subscribe((res:any,barcode:string)=> {
  //     if (res) {
  //       let item = res.result
  //       let data = res.result.productBatch.filter((x: any) => x.barcode == res.barcode);
  //       data = data[0];
        
        
  //       const sub = this.itemGroupService.getProductById(res.result.id).subscribe(result => {
  //         let itemData = result.data;

  //         if (this.formType != Constants.Purchase && this.formType != Constants.PurchaseOrder &&
  //           this.formType != Constants.PurchaseReturn && item.type === 'Product' && item.quantity <= 0) {
  //           this.toastr.warning('Selected Item is not in stock');
  //         }
  //         this.order.items[idx].batchName = data.batchName;
  //         this.order.items[idx].warehouseName = data.warehouseName;
  //         this.order.items[idx].mfgDate = data.mfgDate;
  //         this.order.items[idx].expDate = data.expDate;
  //         this.order.items[idx].qty = 1;
  //         this.order.items[idx].name = item.name!;
  //         this.order.items[idx].taxId = itemData.taxId;
  //         this.order.items[idx].hsnCode = item?.hsnCode ?? '';
  //         this.order.items[idx].unit = item?.unit ?? '';
  //         this.order.items[idx].type = this.constants.Item;
  //         ;

  //         if (this.formType === Constants.Sale || this.formType === Constants.SaleOrder ||
  //           this.formType === Constants.SaleReturn || this.formType === Constants.Tax_Invoice ||
  //           this.formType === Constants.Pos || this.formType === Constants.Service_Invoice) {
  //           this.order.items[idx].price = data.sellingPrice;
  //         } else {
  //           this.order.items[idx].price = data.purchasePrice;
  //         }
  //         this.selectTaxSlab(idx);
  //         this.calcItemPrice(idx);

  //         if (itemData.discount > 0) {
  //           if (itemData.discountInPercentage) {
  //             this.order.items[idx].discountInPercent = itemData.discount;
  //             this.calcDiscAmount(idx);
  //           } else {
  //             this.order.items[idx].discountInRupees = itemData.discount;
  //             this.calcDiscountPercent(idx);
  //           }
  //         }
  //       });   
  //     }
  //   });
  // }

  selectItem(item: ItemWithDetails, idx: number) {  
    this.itemGroupService.getProductById(item.id!).subscribe(res => {
      let itemData = res.data;
      if (this.formType != Constants.Purchase && this.formType != Constants.PurchaseOrder && this.formType != Constants.PurchaseReturn
        && item.type === 'Product' && item.quantity <= 0) {
        this.toastr.warning('Selected Item is not in stock');
      }
      // Batches = 1
      if (itemData.productBatch && itemData.productBatch.length === 1 &&
        itemData.productBatch[0].batchName === 'DEFAULT' && itemData.productBatch[0].warehouseName === 'DEFAULT' ) {
        this.order.items[idx].qty = 1;
        this.order.items[idx].name = item.name!;
        this.order.items[idx].description = itemData.description;
        this.order.items[idx].taxId = itemData.taxId;
        this.order.items[idx].hsnCode = item?.hsnCode ?? '';
        this.order.items[idx].unit = item?.unit ?? '';
        this.order.items[idx].type = this.constants.Item;

        if (this.formType === Constants.Sale || this.formType === Constants.SaleOrder ||
          this.formType === Constants.SaleReturn || this.formType === Constants.Tax_Invoice ||
          this.formType === Constants.Pos || this.formType === Constants.Service_Invoice) {
          this.order.items[idx].price = item.sellingPrice;
        } else {
          this.order.items[idx].price = item.purchasePrice;
        }
        this.selectTaxSlab(idx);
        this.calcItemPrice(idx);

        if (itemData.discount > 0) {
          if (itemData.discountInPercentage) {
            this.order.items[idx].discountInPercent = itemData.discount;
            this.calcDiscAmount(idx);
          } else {
            this.order.items[idx].discountInRupees = itemData.discount;
            this.calcDiscountPercent(idx);
          }
        }
      } else {
        let dialogRef = this.dialog.open(SalePurchaseBatchModelComponent, {
          width: '98%',
          autoFocus: false,
          data: {
            name: item.name,
            batches: (this.formType === Constants.Purchase || this.formType === Constants.PurchaseOrder)?[]: itemData.productBatch,
            showAddBatchBtn: this.formType === Constants.Purchase || this.formType === Constants.PurchaseOrder,
            type:(this.formType === Constants.Purchase || this.formType === Constants.PurchaseOrder)?'purchase':'sale'
          },
        });
        const sub = dialogRef.afterClosed().subscribe(batchData => {
          for (let i = 0; i < batchData?.batches.length; i++) {
            let batch = batchData.batches[i];
            if (batch?.selectedQuantity > 0) {
              let itemToAdd = {
                barCode:batch.barcode,
                name: item.name!,
                taxId: itemData.taxId,
                hsnCode: item?.hsnCode ?? '',
                unit: item.unit,
                description : item.description,
                batchName: batch.batchName,
                mfgDate: batch.mfgDate,
                expDate: batch.expDate,
                warehouseName: batch.warehouseName,
                qty: batch.selectedQuantity,
                purchasePrice:batch.purchasePrice,
                sellingPrice:batch.sellingPrice,
                discountInPercent: 0,
                discountInRupees: 0,
                taxAmount: 0,
                totalAmount: 0,
                price: 0,
                taxName: '',
                taxPercent: 0,
                type: this.constants.Item
              };

              if (this.formType === Constants.Sale || this.formType === Constants.SaleOrder ||
                this.formType === Constants.SaleReturn || this.formType === Constants.Tax_Invoice ||
                this.formType === Constants.Pos || this.formType === Constants.Service_Invoice) {
                itemToAdd.price = batch.sellingPrice ?? 0;
              } else {
                itemToAdd.price = batch.purchasePrice ?? 0;
              }

              this.order.items.splice(idx, 0, itemToAdd);
              this.order.items.splice(idx+1,1);
              this.selectTaxSlab(idx);
              this.calcItemPrice(idx);

              if (itemData.discount > 0) {
                if (itemData.discountInPercentage) {
                  this.order.items[idx].discountInPercent = itemData.discount;
                  this.calcDiscAmount(idx);
                } else {
                  this.order.items[idx].discountInRupees = itemData.discount;
                  this.calcDiscountPercent(idx);
                }
              }
              idx++;                
            }
          }
          sub.unsubscribe();
        });
      }
      this.isItemDropdownOpen = false;
      this.filteredItems = [...this.items];
    });
  }

  selectExpense(exp: Ledger, idx: number) {
    this.order.items[idx].qty = 1;
    this.order.items[idx].name = exp.name!;
    this.order.items[idx].hsnCode = exp?.hsnCode ?? '';
    this.order.items[idx].type = this.constants.Expense;
    this.order.items[idx].taxId = exp.taxId;
    this.selectTaxSlab(idx);
    this.updateExpenseItemsTax();
    this.isItemDropdownOpen = false;
  }

  selectLedger(exp: Ledger, idx: number) {    
    this.order.items[idx].qty = 1;
    this.order.items[idx].name = exp.name!;
    this.order.items[idx].hsnCode = exp?.hsnCode ?? '';
    this.order.items[idx].type = this.constants.OtherLedger;
    this.order.items[idx].taxId = exp.taxId;
    this.selectTaxSlab(idx);
    this.updateExpenseItemsTax();
    this.isItemDropdownOpen = false;
  }

  updateExpenseItemsTax() {
    let taxItems = this.order.items.filter(x => x.type === this.constants.Item && x.taxPercent > 0);
    if (taxItems?.length > 0) {
      let maxTax = Math.max(...taxItems.map(x => x.taxPercent));
      let taxItem = taxItems.find(x => x.taxPercent === maxTax);
      let taxSlab = this.taxSlabs.find(x => x.id == taxItem.taxId);

      for (let i = 0; i < this.order.items.length; i++) {
        if (this.order.items[i].type === this.constants.Expense) {
          this.order.items[i].taxId = taxItem.taxId;
          this.order.items[i].taxName = taxSlab.name!;
          this.order.items[i].taxPercent = taxSlab.valueInPercent!;
          this.calcItemPrice(i);
        }
      }
    }
  }

  filterItems(idx: number, e?: any) {       
    if (e) {
      let filterByValue = this.order.items[idx].name.toLowerCase();
      if (e.key == 'Enter') {
        for (let x of this.items) {
          let found = false;
          
          if (filterByValue == x.name.toLowerCase()) {
            this.selectItem(x, idx);   
            found = true;
          }
          if (found) {
            break;
          }
          for (let y of x.productBatch) {
               if (y.barcode && filterByValue == y.barcode.toLowerCase()) {              
                 this.isItemDropdownOpen = false;
                 let item = this.filteredItems.filter((x, id) => id == idx);
                 this.order.items[idx].name = x.name;
                 this.order.items[idx].description = x.description;
                 this.order.items[idx].hsnCode = x.hsnCode;
                 this.order.items[idx].unit = x.unit;
                 this.order.items[idx].batchName = y.batchName;
                 this.order.items[idx].warehouseName = y.warehouseName;
                 this.order.items[idx].mfgDate = y.mfgDate;
                 this.order.items[idx].expDate = y.expDate;
                 this.order.items[idx].qty = 1;
                 this.order.items[idx].type = this.constants.Item;
                 this.order.items[idx].taxId = x.taxId;
                 if (this.formType == this.constants.Purchase || this.formType == this.constants.PurchaseOrder || this.formType == this.constants.PurchaseReturn) {
                   this.order.items[idx].price = y.purchasePrice;   
                 } else {                   
                   this.order.items[idx].price = y.sellingPrice;   
                 }
              this.selectTaxSlab(idx);
              this.calcItemPrice(idx);
              if (x.discount > 0) {
                if (x.discountInPercentage) {
                  this.order.items[idx].discountInPercent = x.discount;
                  this.calcDiscAmount(idx);
                } else {
                  this.order.items[idx].discountInRupees = x.discount;
                  this.calcDiscountPercent(idx);
                }
              }
              if (idx == (this.order.items.length - 1)) {                
                this.isItemDropdownOpen = true;
                this.addRow();
                this.editingIdx = idx + 1;
                setTimeout(() => {
                  document.getElementById('itemname-' + (idx + 1)).focus();
                }, 50);              
                 }
                 this.filteredItems = [...this.items];
                 found = true;
                 break;
            }
          }
          if (found) {
            break;
          }
        }
      } else {
        this.isItemDropdownOpen = true;
        if (filterByValue.length > 0) {
          this.filteredItems = this.items.filter(x => x.name?.toLowerCase().includes(filterByValue.toLowerCase()) ||
            x.alias?.toLowerCase().includes(filterByValue.toLowerCase()) ||
            x.code?.toLowerCase().includes(filterByValue.toLowerCase()) ||
            x.productBatch.filter(y =>
              (y.barcode?.toLowerCase().includes(filterByValue.toLowerCase()))
            )?.length > 0
          );          
          this.filteredExpenseLedgers = this.expenseLedgers.filter(x => x.name?.toLowerCase().includes(filterByValue.toLowerCase())||
          x.alias?.toLowerCase().includes(filterByValue.toLowerCase()) );
          this.filteredLedgers = this.ledgers.filter(x => x.name?.toLowerCase().includes(filterByValue.toLowerCase()) ||
            x.alias?.toLowerCase().includes(filterByValue.toLowerCase())
          );
        } else {
          if (this.items?.length > 0) {            
            this.filteredItems = [...this.items];
            this.filteredExpenseLedgers = [...this.expenseLedgers];
          } else {
            this.filteredItems = [];
            this.filteredExpenseLedgers = [];
          }
        }
      }
    }
  }

  selectTaxSlab(idx: number, updateExpenseItems: boolean = true) {
    let taxSlab = this.taxSlabs.find(x => x.id == this.order.items[idx].taxId);
    if (taxSlab) {
      this.order.items[idx].taxName = taxSlab.name!;
      this.order.items[idx].taxPercent = taxSlab.valueInPercent!;
    } else {
      this.order.items[idx].taxAmount = 0;
    }
    this.calcItemPrice(idx);
    if (updateExpenseItems || (!updateExpenseItems && this.order.items[idx].type === this.constants.Item))
      this.updateExpenseItemsTax();
  }

  calcDiscAmount(idx: number) {
    if (this.order.items[idx].discountInPercent === 0) {
      this.order.items[idx].discountInRupees = 0;
      return;
    }

    if (this.selectedItemPriceType === this.constants.WITH_TAX) {
      this.order.items[idx].discountInRupees = this.roundOffToDecimalPlaces(
        ((this.order.items[idx].qty * this.order.items[idx].price) *
          (100 / (100 + this.order.items[idx].taxPercent))) *
        (this.order.items[idx].discountInPercent / 100));
    } else {
      this.order.items[idx].discountInRupees = this.roundOffToDecimalPlaces(
        this.order.items[idx].qty * this.order.items[idx].price *
        this.order.items[idx].discountInPercent / 100);
    }
  }

  calcDiscountPercent(idx: number) {
    if (this.selectedItemPriceType === this.constants.WITH_TAX) {
      this.order.items[idx].discountInPercent = this.roundOffToDecimalPlaces(
        (this.order.items[idx].discountInRupees * (100 + this.order.items[idx].taxPercent)) /
        (this.order.items[idx].qty * this.order.items[idx].price));
    } else {
      this.order.items[idx].discountInPercent = this.roundOffToDecimalPlaces(
        (this.order.items[idx].discountInRupees * 100) / (this.order.items[idx].qty * this.order.items[idx].price));
    }
    this.calcItemPrice(idx, false);
  }

  calcItemPrice(idx: number, doCalcDiscAmount: boolean = true, doCalcTotalAmount: boolean = true) {
    if (doCalcDiscAmount)
      this.calcDiscAmount(idx);
    if (this.order.items[idx].taxPercent > 0) {
      if (this.selectedItemPriceType === this.constants.WITH_TAX) {
        this.order.items[idx].taxAmount = this.roundOffToDecimalPlaces(((this.order.items[idx].qty * this.order.items[idx].price) *
          (100 / (100 + this.order.items[idx].taxPercent))) *
          (1 - (this.order.items[idx].discountInPercent / 100)) *
          (this.order.items[idx].taxPercent / 100));
      } else {
        this.order.items[idx].taxAmount = this.roundOffToDecimalPlaces(
          ((this.order.items[idx].price * this.order.items[idx].qty) - this.order.items[idx].discountInRupees)
          * (this.order.items[idx].taxPercent / 100));
      }
    } else {
      this.order.items[idx].taxAmount = 0;
    }

    if (doCalcTotalAmount) {
      if (this.selectedItemPriceType === this.constants.WITH_TAX) {
        this.order.items[idx].totalAmount = this.roundOffToDecimalPlaces(((this.order.items[idx].qty * this.order.items[idx].price) *
          (100 / (100 + this.order.items[idx].taxPercent))) *
          (1 - (this.order.items[idx].discountInPercent / 100)) *
          (1 + (this.order.items[idx].taxPercent / 100)));
      } else {
        this.order.items[idx].totalAmount = this.roundOffToDecimalPlaces(
          ((this.order.items[idx].price * this.order.items[idx].qty)
            - this.order.items[idx].discountInRupees) + this.order.items[idx].taxAmount);
      }
    }

    this.order.totalAmount = this.getTotalAmount();
    this.roundOffTotalAmount();
  }

  roundOffToDecimalPlaces(value: number, decimalPlaces: number = 2): number {
    return parseFloat(value.toFixed(decimalPlaces));
  }

  getTotalQty(): number {
    let value = 0;
    this.order.items.forEach(item => { 
      if (item.type!=this.constants.Expense) {
        value += item.qty; 
      }
    });
    return value;
  }

  getTotalDiscount(): number {
    let value = 0;
    this.order.items.forEach(item => { value += item.discountInRupees; });
    return value;
  }

  getTotalTax(): number {
    let value = 0;
    this.order.items.forEach(item => { value += item.taxAmount; });
    if (this.order.billingStateId && this.currentCompany?.billingAddress?.state?.id) {
      if (this.order.billingStateId == this.currentCompany.billingAddress.state.id) {
        this.order.cgst = value / 2;
        this.order.sgst = value / 2;
        this.order.igst = null;
      } else {
        this.order.igst = value;
        this.order.cgst = null;
        this.order.sgst = null;
      }
    } else {
      this.order.cgst = value / 2;
      this.order.sgst = value / 2;
      this.order.igst = null;
    }
    return value;
  }

  getTotalAmount(): number {
    let value = 0;
    this.order.items.forEach(item => { value += item.totalAmount; });
    value = this.roundOffToDecimalPlaces(value);
    return value;
  }

  updateReceivedAmount() {
    if (this.order.hasReceivedAdvance) {
      this.order.advanceAmount = this.order.totalAmountWithRoundOff;
    } else {
      this.order.advanceAmount = 0;
    }
    this.order.balanceAmount = this.order.totalAmountWithRoundOff - this.order.advanceAmount;
  }

  updateBalanceAmount() {
    this.order.hasReceivedAdvance = this.order.advanceAmount > 0;
    this.order.balanceAmount = this.order.totalAmountWithRoundOff - this.order.advanceAmount;
  }

  roundOffTotalAmount() {
    if (this.order.hasRoundOff) {
      this.order.totalAmountWithRoundOff = Math.round(this.order.totalAmount);
      this.order.roundOff = this.roundOffToDecimalPlaces(this.order.totalAmountWithRoundOff - this.order.totalAmount);
    } else {
      this.order.totalAmountWithRoundOff = this.order.totalAmount;
      this.order.roundOff = 0;
    }
    this.order.amountInWords = BusinessHelpers.numberToWords(this.order.totalAmountWithRoundOff.toString());
    this.updateBalanceAmount();
  }

  truncateToTwoDecimalPlaces(text: number) {
    let value = text?.toString() ?? '';
    if (value.includes('.') && value.split('.')[1].length > 2) {
      value = value.split('.')[0] + '.' + value.split('.')[1].substring(0, 2);
    }
    return value;
  }

  calcPricePerUnit(idx: number) {
    if (this.selectedItemPriceType === this.constants.WITH_TAX) {
      this.order.items[idx].price = this.roundOffToDecimalPlaces(
        (this.order.items[idx].totalAmount * (100 + this.order.items[idx].taxPercent)) /
        (100 * (1 + (this.order.items[idx].taxPercent / 100))
          * (1 - (this.order.items[idx].discountInPercent / 100))) / this.order.items[idx].qty);
    } else {
      let price = this.order.items[idx].totalAmount / this.order.items[idx].qty;
      if (this.order.items[idx].taxAmount > 0) {
        price = price / (1 + (this.order.items[idx].taxPercent / 100));
      }
      if (this.order.items[idx].discountInPercent > 0) {
        price = price / (1 - (this.order.items[idx].discountInPercent / 100));
      }
      this.order.items[idx].price = this.roundOffToDecimalPlaces(price);
    }
    this.calcItemPrice(idx, true, false);
  }

  updateItemPrices() {
    this.order.items.forEach((item, idx) => { this.calcItemPrice(idx); })
  }

  saveOrderDetails() {
    this.order.items.forEach((x, idx) => {
      if (x.name == undefined || x.name == '') {
        this.order.items.splice(idx, 1);
      }
    })
    if (this.hasPassedFormValidations()) {
      this.order.hasTax = this.selectedItemPriceType === this.constants.WITH_TAX;
      this.order.totalDiscount = this.getTotalDiscount();
      this.order.totalTax = this.getTotalTax();
      
      if (this.cashOrBank != this.constants.Bank) {
        this.order.paymentTypeId = null
      }
      
      this.order.ledgers = [...this.order.items.filter(x => x.type === this.constants.Expense || x.type === this.constants.OtherLedger)];
      this.order.items = [...this.order.items.filter(x => x.type === this.constants.Item)];
      if (this.order.terms.length == 0||this.order.terms==undefined) {
        this.order.terms = this.terms;
      }
      this.appStateService.sendEvent(AppEvents.SidebarToggle, false);
      this.isSubmitDisabled = true;
      
      // this.submitButton.emit(true);
      this.saveOrder.emit(this.order);
    }
  }

  hasPassedFormValidations(): boolean {
    if (this.uiPlaceholders.isPartyDropdownVisible && this.isNullOrEmpty(this.order.partyName)) {
      this.toastr.error(`${this.uiPlaceholders.party} is required. Please enter a value`);
      this.focusFieldById('party-dropdown');
      return false;
    }

    if (this.uiPlaceholders.isCustomerNameVisible && this.isNullOrEmpty(this.order.customerName)) {
      this.toastr.error(`Customer name is required. Please enter a value`);
      this.focusFieldById('customer-name');
      return false;
    }

    if (this.order.items && this.order.items.length > 0) {
      for (let i = 0; i < this.order.items.length; i++) {
        if (this.isNullOrEmpty(this.order.items[i].name)) {
          this.toastr.error(`Item name is required. Please enter a value or remove extra rows`);
          this.focusFieldById('items-tbl', false);
          return false;
        }

        if (this.order.items[i].qty <= 0) {
          this.toastr.error(`Item's quantity should be greater than zero`);
          this.focusFieldById('items-tbl', false);
          return false;
        }

        if (this.order.items[i].type === this.constants.Item && this.order.items[i].price <= 0 && this.formType != this.constants.ChallanIn && this.formType != this.constants.ChallanOut) {
          this.toastr.error(`Item's price per unit should be greater than zero`);
          this.focusFieldById('items-tbl', false);
          return false;
        }
      }
    } else {
      this.toastr.error(`Items are required. Please add atleast 1 item`);
      this.focusFieldById('items-tbl', false);
      return false;
    }

    if (this.order.advanceAmount > this.order.totalAmountWithRoundOff) {
      this.toastr.error(`Received amount should not be greater than the total amount`);
      this.focusFieldById('received');
      return false;
    }

    if (this.order.paymentMode != this.constants.Cash && (this.order.paymentTypeId === undefined || this.order.paymentTypeId === null)
      && (this.formType != Constants.PurchaseOrder && this.formType != Constants.SaleOrder) && this.cashOrBank != '') {
      this.toastr.error(`Please select a Bank for the payment`);
      this.focusFieldById('bank');
      return false;
    }
    if (this.order.hasReceivedAdvance && this.cashOrBank == '') {
      this.toastr.error(`Please select a Payment Type for the payment`);
      this.focusFieldById('type');
      return false;
    }

    return true;
  }

  isNullOrEmpty(value: undefined | null | string): boolean {
    return !(value && value.trim().length > 0);
  }

  focusFieldById(id: string, doFocus: boolean = true) {
    const element = document.getElementById(id);
    let position = element.getBoundingClientRect();
    window.scrollTo(position.left, position.top + window.scrollY - 100);
    if (doFocus)
      element.focus();
  }

  getNetAmount(amount: number | undefined | null) {
    if (amount == undefined || amount === null)
      return 0;
    return Math.abs(amount);
  }

  goBack() {
    this.appStateService.sendEvent(AppEvents.SidebarToggle, false);
    this.location.back();
  }

  truncateString(str: string): string {
    const maxLength = 20;
    if (str && str.length > maxLength) {
      return str.substring(0, maxLength) + '...';
    }
    return str;
  }

  updatePendingOrderInfo() {
    const id = this.order.referenceId;
    const orderNum = this.order.orderNumber;
    const transaction = this.pendingOrders.find(x => x.id == id);

    if (this.formType === this.constants.Sale || this.formType === this.constants.Tax_Invoice || this.formType === this.constants.Service_Invoice) {
      if (transaction.identifier=='Challan Out') {
        const sub = this.saleService.getChallanOutById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      } else {
        const sub = this.saleService.getSaleOrderById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      }
    } else if (this.formType === this.constants.SaleReturn) {
      if (transaction.identifier == 'Sale') {
        const sub = this.saleService.getSaleInvoiceById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      } else if (transaction.identifier == 'Tax Invoice') {
        const sub = this.saleService.getTaxInvoiceById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      } else if (transaction.identifier == 'Service Invoice') {
        const sub = this.saleService.getServiceInvoiceById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      }
    } else if (this.formType === this.constants.Purchase) {
      if (transaction.identifier=='Challan In') {
        const sub = this.purchaseService.getPurchaseOrderById(id).subscribe(res => {
        this.order = BusinessHelpers.MapFromApiModel(res.data);
        this.order.items = [...this.order.items, ...this.order.ledgers];
        this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
        sub.unsubscribe();
      });
      } else {
        const sub = this.purchaseService.getPurchaseOrderById(id).subscribe(res => {
          this.order = BusinessHelpers.MapFromApiModel(res.data);
          this.order.items = [...this.order.items, ...this.order.ledgers];
          this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
          sub.unsubscribe();
        });
      }
    } else if (this.formType === this.constants.PurchaseReturn) {
      const sub = this.purchaseService.getPurchaseBillById(id).subscribe(res => {
        this.order = BusinessHelpers.MapFromApiModel(res.data);
        this.order.items = [...this.order.items, ...this.order.ledgers];
        this.sanitizeOrderModel(orderNum, id, `${res.data.orderPrefix}${res.data.orderNumber}${res.data.orderSuffix}`, res.data.orderDate);
        sub.unsubscribe();
      });
    }
  }

  sanitizeOrderModel(orderNum: string, referenceId: number, supplierInvNum: string, supplierInvDate: string) {
    this.order.id = null;
    this.order.referenceId = referenceId;
    this.order.orderDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.order.orderNumber = orderNum;
    this.order.paymentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.order.items.forEach(x => {
      x.id = null;
      x.taxName = '';
      x.taxPercent = 0;

      let taxSlab = this.taxSlabs.find(y => y.id == x.taxId);
      if (taxSlab) {
        x.taxName = taxSlab.name!;
        x.taxPercent = taxSlab.valueInPercent!;
      }
    });
    this.order.suppliersInvoiceNumber = supplierInvNum;
    this.order.suppliersInvoiceDate = supplierInvDate;
    this.order.transactions = [];
  }

  onCashOrBank() {
    if (this.cashOrBank.length > 0) {
      if (this.cashOrBank === this.constants.Cash)
        this.order.paymentMode = this.constants.Cash;
      else
        this.order.paymentMode = this.constants.Cheque;
    } else {
      this.cashOrBank = '';
      this.order.paymentMode = null;
    }
  }

  clearParty() {
    this.order.partyId = null;
    this.order.partyName = '';

    this.filterParty();
    this.isPartyDropdownOpen = true;
    this.pendingOrders = [];

    this.order.referenceId = null;
    this.order.suppliersInvoiceDate = null;
    this.order.suppliersInvoiceNumber = null;
  }

  addNewParty() {
    let partyDialogRef = this.dialog.open(AddPartyComponent, {
      width: '90%',
      height: '90%',
      autoFocus: false,
      data: {
        partyName: this.order.partyName
      }
    });

    const sub = partyDialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.partyService.getAllParties().subscribe(parties => {
          this.parties = parties.data;
          this.filteredParties = [...this.parties];

          let party = this.parties.find(x => x.id == parseInt(res));
          if (party) {
            this.selectParty(party);
          }
          sub.unsubscribe();
        });
      } else {
        sub.unsubscribe();
      }
    });
  }

  addNewItem(idx: number) {
    let itemDialogRef = this.dialog.open(AddEditItemComponent, {
      width: '90%',
      height: '90%',
      autoFocus: false,
      data: {
        itemName: this.order.items[idx].name,
        type:(this.formType==this.constants.PurchaseOrder|| this.formType==this.constants.Purchase)?'purchase':'sale'
      }
    });

    const sub = itemDialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.itemService.getAllItemsWithDetails().subscribe(items => {
          this.items = items.data;
          if (this.items?.length > 0)
            this.items.sort((a, b) => {
              if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
              if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
              return 0;
            });

          if (this.formType == Constants.Service_Invoice) {
            this.items = this.items.filter(x => x.type === 'Service');
          }
          if (this.items?.length > 0)
            this.filteredItems = [...this.items];
          else
            this.filteredItems = [];

          let item = this.items.find(x => x.id == parseInt(res));
          if (item) {
            this.selectItem(item, idx);
          }
        });
      } else {
        sub.unsubscribe();
      }
    });
  }

  clearItem(idx: number) {
    this.order.items[idx] = BusinessHelpers.initNewItem();
    this.filteredItems = [...this.items];
    this.selectTaxSlab(idx);
    this.calcItemPrice(idx);
  }

  updateDispatchExportDetails(type: string) {
    let dialogRef = this.dialog.open(DispatchExportDetailsModalComponent, {
      width: type === this.constants.Dispatch ? '60%' : '80%',
      autoFocus: false,
      data: {
        type: type,
        exportAndDispatchDetails: this.order.exportAndDispatchDetails,
      },
    });
    const sub = dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.order.exportAndDispatchDetails = res;
      }
      sub.unsubscribe();
    });
  }

  setSignature(signId: number) {
    this.order.signatureId = signId;
    this.selectedSignature = this.signatures.find(x => x.id == signId)?.signature ?? '';
    this.isSignDropdownOpen = false;
  }
}
