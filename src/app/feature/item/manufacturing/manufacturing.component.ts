import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Item, Product } from 'src/app/core/api-models/item-model';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { AdjustItemDialogComponent } from '../adjust-item-dialog/adjust-item-dialog.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-manufacturing',
  templateUrl: './manufacturing.component.html',
  styleUrls: ['./manufacturing.component.scss']
})
export class ManufacturingComponent {
  data: Array<Item> = [];
  filteredData: Array<Item> = [];
  selectedItem: Item = {};
  tableData: Array<Product> = [];
  filteredTableData: Array<Product> = [];
  id: number | undefined = NaN;
  index: number = 0;
  filterText: string = '';
  filterItemText: string = '';
  sellingPrice: number = 0;
  sellingPriceHasTax: boolean = false;
  purchasePrice: number = 0;
  purchasePriceHasTax: boolean = false;
  showAdjustItemBtn: boolean = true;
  userPermissions: UserPermissions;
  constants = Constants;

  constructor(private itemService: ItemService, private dialog: MatDialog, private router: Router,
    private itemGroupService: ItemGroupService, private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.itemService.getAllItemsWithDetails().subscribe(res => {
      if (res.code === 200) {
        this.data = res.data;
        this.data = this.data.filter(item => item.manufacturedProduct === true);
        this.filteredData = this.data;
        console.log(this.filteredData);
        
        this.data.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
        this.selectedItem = this.data[0];
        this.selectItem(this.index);
      }
      sub.unsubscribe();
    });
  }

  openAdjustItemDialog(id: number) {
    let dialogRef = this.dialog.open(AdjustItemDialogComponent, {
      width: '90%',
      autoFocus: false,
      data: { id: id },
    });
    dialogRef.afterClosed().subscribe(res => {
      this.loadTableData();
    });
  }

  selectItem(idx: number) {
    this.index = idx;
    this.selectedItem = this.data[idx];
    this.id = this.data[idx].id;
    this.tableData = [];
    this.filteredTableData = [];
    this.sellingPrice = 0;
    this.purchasePrice = 0;
    this.sellingPriceHasTax = false;
    this.purchasePriceHasTax = false;
    this.showAdjustItemBtn = true;

    const sub = this.itemService.getByProductId(this.id!).subscribe(res => {
      if (res.code === 200) {
        this.tableData = res.data;
        this.tableData = this.tableData.filter(x => x.reservedQuantity > 0);
        this.filteredTableData = [...this.tableData];
      }
      sub.unsubscribe();
    });

    const productSub = this.itemGroupService.getProductById(this.id!).subscribe(res => {
      if (res.code === 200 && res.data.productBatch?.length > 0) {
        this.showAdjustItemBtn = res.data.type === 'Product';
        this.sellingPrice = res.data.productBatch[0].sellingPrice ?? 0;
        this.purchasePrice = res.data.productBatch[0].purchasePrice ?? 0;;
        this.sellingPriceHasTax = res.data.productBatch[0].sellingPriceHasTax ?? false;;
        this.purchasePriceHasTax = res.data.productBatch[0].purchasePriceHasTax ?? false;;
      }
      productSub.unsubscribe();
    });
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  openDeleteDialog(idx: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected Item?',
        title: 'Delete Item'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        // let id: number | undefined = this.data[idx].id;
        this.itemService.deleteProduct(idx!).subscribe(response => {
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredTableData = this.tableData.filter(x =>
        (x.partyName && x.partyName.toLowerCase().includes(text)) ||
        (x.billNumber && x.billNumber.toLowerCase().includes(text)) ||
        (x.transactionType && x.transactionType.toLowerCase().includes(text)) ||
        (x.pricePerUnit != undefined && x.pricePerUnit >= 0 && x.pricePerUnit.toString().includes(text)));
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

  filterItems() {
    if (this.filterItemText?.length > 0) {
      let text = this.filterItemText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

  getTransactionType(data: Product): string {
    if (data.transactionType === 'Opening Balance') {
      if (data.productStockType === 'OPENING_BALANCE') return 'Opening Balance';
      else if (data.productStockType === 'REDUCE_ADJUSTMENT') return 'Reduce Stock';
      else if (data.productStockType === 'ADD_ADJUSTMENT') return 'Add Stock';
      else return '';
    } else {
      return data.transactionType;
    }
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Item, permissionValue);
  }



  openTransactionModal(item: Item) {
    let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
      data: {
        data: item,
        type: 'item'
      },
    });
  }
}
