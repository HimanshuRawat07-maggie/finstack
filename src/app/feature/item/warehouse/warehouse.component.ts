import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddWarehouseComponent } from '../add-warehouse/add-warehouse.component';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { Column } from 'src/app/core/models/grid';
import { BusinessHelpers } from 'src/app/core/helpers/business';
import { Constants, ModuleConstants } from 'src/app/core/constants/app-constant';
import { UserPermissions } from 'src/app/core/api-models/permission-model';
import { AppStateService } from 'src/app/core/services/app-state/app.state.service';
import { TransactionModalComponent } from '../transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-godown',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  data: Array<Warehouse> = []
  filteredData: Array<Warehouse> = []
  userPermissions: UserPermissions;
  constants = Constants;
  filterWarehouseText: string = '';

  constructor(private dialog: MatDialog, private warehouseService: WarehouseService, private toastr: ToastrService, private appStateService: AppStateService) { }

  ngOnInit() {
    this.appStateService.currentUserPermission().subscribe(res => { this.userPermissions = res; });
    this.loadTableData();
  }

  loadTableData() {
    const sub = this.warehouseService.getAllWarehouses().subscribe(res => {
      this.data = res.data;
      this.filteredData = res.data;
      this.data.sort((a, b) => {
        if (a.name!?.toLowerCase() < b.name!?.toLowerCase()) { return -1; }
        if (a.name!?.toLowerCase() > b.name!?.toLowerCase()) { return 1; }
        return 0;
      });
      this.data = [...this.data.filter(x => x.name === 'DEFAULT'), ...this.data.filter(x => x.name != 'DEFAULT')]
      this.filteredData = [...this.data];
      sub.unsubscribe();
    });
  }

  openModal() {
    let dialogRef = this.dialog.open(AddWarehouseComponent, {
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

  openDeleteDialog(id: number, event: MouseEvent) {
        event.stopPropagation();
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to delete the selected godown?',
        title: 'Delete Godown'
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.warehouseService.deleteWarehouse(id!).subscribe(response => {
          if (response.code == 200) {
            this.toastr.success('Warehouse deleted successfully');
            this.loadTableData();
            dialogRef.close(true);
          }
          else {
            this.toastr.error(response.message);
          }
        });
      }
    });
  }


  toggleMenu(itemId: number) {
    this.data.forEach(item => {
      item.isMenuVisible = item.id === itemId;
    });
  }

  openEdit(id: number,event:MouseEvent) {
        event.stopPropagation();
    let dialogRef = this.dialog.open(AddWarehouseComponent, {
      autoFocus: false,
      width: '30%',
      data: {
        id: id
      },
    });

    dialogRef.componentInstance.confirmed.subscribe(res => {
      if (res) {
        this.loadTableData();
      }
    });
  }

  hasPermission(permissionValue: string) {
    return BusinessHelpers.hasPermission(this.userPermissions, ModuleConstants.Warehouse, permissionValue);
  }

  filterWarehouse() {
    if (this.filterWarehouseText?.length > 0) {
      let text = this.filterWarehouseText.toLowerCase();
      this.filteredData = this.data.filter(x =>
        (x.name && x.name.toLowerCase().includes(text)));
    } else {
      this.filteredData = [...this.data];
    }
  }

   openTransactionModal(warehouse:any) {
     let dialogRef = this.dialog.open(TransactionModalComponent, {
      autoFocus: false,
      width: '95%',
       data: {
         data: warehouse,
         type:'warehouse'
      },
    });
  }

}
