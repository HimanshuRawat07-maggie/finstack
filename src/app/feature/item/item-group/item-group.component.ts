import { Component, OnInit } from '@angular/core';
import { AddCategoryModalComponent } from '../add-category-modal/add-category-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { GetItemByGroupId, GetProductGroup } from 'src/app/core/api-models/item-group';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { LinkItemGroupComponent } from '../link-item-group/link-item-group.component';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';

@Component({
  selector: 'app-item-group',
  templateUrl: './item-group.component.html',
  styleUrls: ['./item-group.component.scss']
})
export class ItemGroupComponent implements OnInit {
  selectedItem: GetProductGroup = {};
  item: any;
  data: Array<GetProductGroup> = [];
  filteredData: Array<GetProductGroup> = [];
  index: number = 0;
  id: number | undefined = NaN;
  filteredTableData: Array<GetItemByGroupId> = [];
  tableData: Array<GetItemByGroupId> = [];
  isLinkVisible = false;
  filterText: string = '';
  userPermissions: UserPermissions;
  constants = Constants;
  filterItemText: string = '';
  expandedGroupIdx: number;

  constructor(private dialog: MatDialog, private appStateService: AppStateService, private itemgroupService: ItemGroupService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.itemgroupService.getAllProductGroup().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      this.selectedItem = this.data[0];
      sub.unsubscribe();
    });
  }

  openModal() {
    let dialogRef = this.dialog.open(AddCategoryModalComponent, {
      autoFocus: false,
      width: '30%',
      data: {},
    });
    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openEdit(id: number, name: string) {
    let dialogRef = this.dialog.open(AddCategoryModalComponent, {
      width: '30%',
      data: {
        message: id,
        name: name
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  openDeleteDialog(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected Item Group?',
        title: 'Delete Item Group'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.itemgroupService.deleteProductGroup(id!).subscribe(response => {
          if (response.code == 200) {
            this.toastr.success('Deleted Successfully');
          } else {
            this.toastr.error(response.message);
          }
          this.loadTableData();
          dialogRef.close(true);
        });
      }
    });
  }

  selectItem(idx: number) {
    this.index = idx;
    this.selectedItem = this.data[idx];
    this.tableData = [];
    this.filteredTableData = [];
    if (this.selectedItem.productGroupName == 'Not In Any Group') {
      this.isLinkVisible = true;
    }
    else {
      this.isLinkVisible = false;
    }
    this.id = this.data[idx].id;
    this.loadItemTable(this.id!);
    this.expandedGroupIdx = idx;
  }

  loadItemTable(id: number) {
    const sub = this.itemgroupService.getByProductGroupId(this.id!).subscribe(res => {
      if (res.code === 200) {
        this.tableData = res.data;
        this.filteredTableData = [...this.tableData];
      }
      sub.unsubscribe();
    });
  }

  toggleMenu(itemId: number) {
    this.data.forEach(item => {
      if (item.id !== itemId) {
        item.isMenuVisible = false;
      }
    });

    const selectedItem = this.data.find(item => item.id === itemId);
    if (selectedItem) {
      selectedItem.isMenuVisible = !selectedItem.isMenuVisible;
    }
  }

  unlinkProduct(id: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to unlink the selected Item ?',
        title: 'Unlink Item '
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        const sub = this.itemgroupService.unlinkProduct(id).subscribe(res => {
          if (res.code == 200) {
            this.loadItemTable(this.id!);
            this.loadTableData();
          } else {
            this.toastr.error(res.message);
          }
          dialogRef.close(true);
          sub.unsubscribe();
        });
      }
    });
  }

  linkProduct(id: number) {
    let dialogRef = this.dialog.open(LinkItemGroupComponent, {
      autoFocus: false,
      width: '30%',
      data: {
        message: id
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  filterTransactions() {
    if (this.filterText?.length > 0) {
      let text = this.filterText.toLowerCase();
      this.filteredTableData = this.tableData.filter(x =>
        (x.productName && x.productName.toLowerCase().includes(text)) ||
        // (x.totalQuantity && x.totalQuantity.toLowerCase().includes(text)) ||
        // (x.productStockType && this.getTransactionTypeValue(x.productStockType).toLowerCase().includes(text)) ||
        (x.totalQuantity != undefined && x.totalQuantity >= 0 && x.totalQuantity.toString().includes(text)));
    } else {
      this.filteredTableData = [...this.tableData];
    }
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.ItemGroup, permissionValue);
  }


  filterItems() {
    if (this.filterItemText?.length > 0) {
      let text = this.filterItemText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.productGroupName && x.productGroupName.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

}
