import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item, ItemWithDetails, Product } from 'src/app/core/api-models/item-model';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { AdjustItemDialogComponent } from '../adjust-item-dialog/adjust-item-dialog.component';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { ToastrService } from 'ngx-toastr';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';
import { GetProductGroup } from 'src/app/core/api-models/item-group';

@Component({
  selector: 'app-item-dashboard',
  templateUrl: './item-dashboard.component.html',
  styleUrls: ['./item-dashboard.component.scss']
})
export class ItemDashboardComponent implements OnInit {
  data: Array<ItemWithDetails> = [];
  filteredData: Array<ItemWithDetails> = [];
  filterItemText: string = '';
  showAdjustItemBtn: boolean = true;
  userPermissions: UserPermissions;
  constants = Constants;

  constructor(private itemService: ItemService, private dialog: MatDialog, private router: Router,
    private itemGroupService: ItemGroupService, private appStateService: AppStateService, private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.itemService.getAllItemsWithDetails().subscribe(res => {
      if (res.code === 200) {
        this.data = res.data;
        this.filteredData = res.data;
        if (this.data && this.data.length > 0) {
          this.data.sort((a, b) => {
          if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
          if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
          return 0;
        });
        }
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

  navigateTo(path: string) {
    this.router.navigateByUrl(path);
  }

  openDeleteDialog(idx: number,event:MouseEvent) {
     event.stopPropagation();
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
          if (response.code == 200) {
            this.loadTableData();
            dialogRef.close(true);
          } else {
            this.toastr.error(response.message);
          }
        });
      }
    });
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

  openTransactionModal(item:ItemWithDetails) {
       let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
       data: {
         data: item,
         type:'item'
      },
    });
   }

}

