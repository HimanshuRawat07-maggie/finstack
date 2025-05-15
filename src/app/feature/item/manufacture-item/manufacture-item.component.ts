import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { elements } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AddAdditionalCost, AdjustItem, Item, ManufactureAdjustItem, Manufacturing, Product, ProductBatch, Unit } from 'src/app/core/api-models/item-model';
import { Warehouse } from 'src/app/core/api-models/warehouse-model';
import { ItemGroupService } from 'src/app/core/api-services/item/item-group.service';
import { ItemService } from 'src/app/core/api-services/item/item.service';
import { WarehouseService } from 'src/app/core/api-services/warehouse/warehouse.service';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'app-manufacture-item',
  templateUrl: './manufacture-item.component.html',
  styleUrls: ['./manufacture-item.component.scss']
})
export class ManufactureItemComponent implements OnInit {
  data: Product = {
    manufacture: [{
      name: '',
      quantity: null,
      pricePerUnit: null
    }]
  };
  cloneData: Product = {};
  items: Array<Item> = [];
  date: string = '';
  units: Unit[] = [];
  RequestData: Array<AdjustItem> = [
    {
      batchName: '',
      sourceWarehouseName:''
    }
  ];
  batchesAndWarehouseDetails: Array<ProductBatch> = [];
  batches: Array<string> = [];
  warehouses: Array<string> = [];
  isBatchEnabled = false;
  isWarehouseEnabled = false;
  minDate: string = '';
  details: ManufactureAdjustItem = {
    quantity: 1,
  };
  byProduct: Array<any> = [
    {
      productName: 'Wastage',
      batches: ['DEFAULT'],
      batchName:'DEFAULT'
    },
    {
      productName: 'Scrap',
      batches: ['DEFAULT'],
      batchName: 'DEFAULT',
    },
  ]
  allWarehouses: Array<Warehouse> = [];
  rawItemsOriginalQuantity: Array<number> = [];
  additionalCost: Array<AddAdditionalCost> = [
    {
      chargesArray:['Packaging Charges','Electricity Charges','Labour Charges','Logistics Charges','Other Charges']
    }
  ];
  additionCostOriginalQuantity: Array<AddAdditionalCost> = [
     {
      chargesArray:['Packaging Charges','Electricity Charges','Labour Charges','Logistics Charges','Other Charges']
    }
  ];

  type: string = '';
  chargeOptions: Array<string> = ['Packaging Charges', 'Electricity Charges', 'Labour Charges', 'Logistics Charges', 'Other Charges'];
  isAddAdditionCostButtonVisible = true;
  viewData: any ={};
  getItemId: number = NaN;
  byProductWareHouseNameIdxOne:string=''
  byProductWareHouseNameIdxTwo:string=''

  constructor(private route: ActivatedRoute, private itemGroupService: ItemGroupService, private itemService: ItemService,
    private toastr: ToastrService, private router: Router, private datePipe: DatePipe, private authService: AuthenticationService,
    private warehouseService: WarehouseService) { }
  
  ngOnInit() {
    this.itemGroupService.processing(true);
    this.isBatchEnabled = this.authService.isBatchEnabled == 'true';
    this.isWarehouseEnabled = this.authService.isWarehouseEnabled == 'true';
    
    
    this.minDate = localStorage.getItem('minDate');
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd')!;
    this.loadData();
    this.getAllWarehouses();
    const sub = this.itemService.getAllUnit().subscribe(res => {
      this.units = res.data;
      sub.unsubscribe();
    })
  }

  loadData():any {
    this.route.paramMap.subscribe(parameterMap => {
      let id = parameterMap.get('id');
      this.type = parameterMap.get('type');    
      let productId
      if (this.type == 'edit') {
        const hub = this.itemGroupService.getManufacturedProductById(parseInt(id)).subscribe(res => {
          this.viewData = res.data;
          productId = res.data.productId;
          this.details.batchName = this.viewData.batchName;
          this.byProduct = this.viewData.byProducts;
          this.byProduct[0].batches = ['DEFAULT'];
          this.byProduct[1].batches = ['DEFAULT'];          
          this.additionalCost = [];

          if (this.viewData.packagingCost && this.viewData.packagingCost != 0) {
            this.additionalCost.push({
              charge: 'Packaging Charges', amount: this.viewData.packagingCost, description: this.viewData.packagingChargesDescription
            });
          }
          if (this.viewData.electricityCost && this.viewData.electricityCost != 0) {
            this.additionalCost.push({
              charge: 'Electricity Charges', amount: this.viewData.electricityCost, description: this.viewData.electricityChargesDescription
            });
          }
          if (this.viewData.labourCost && this.viewData.labourCost != 0) {
            this.additionalCost.push({
              charge: 'Labour Charges', amount: this.viewData.labourCost, description: this.viewData.labourChargesDescription
            });
          }
          if (this.viewData.logisticsCost && this.viewData.logisticsCost != 0) {
            this.additionalCost.push({
              charge: 'Logistics Charges', amount: this.viewData.logisticsCost, description: this.viewData.logisticsChargesDescription
            });
          }
          if (this.viewData.otherCost && this.viewData.otherCost != 0) {
            this.additionalCost.push({
              charge: 'Other Charges', amount: this.viewData.otherCost, description: this.viewData.otherChargesDescription
            });
          }
          const sub = this.itemGroupService.getProductById(productId).subscribe(response => {
            this.data = response.data;
            this.data.quantity = this.viewData.quantity;

            this.data.manufacture.forEach((x: any, idx: any) => {
              x.id = this.viewData.products[idx].id;
              x.productId = this.viewData.products[idx].productId;
              x.batchName= this.viewData.products[idx].batchName
            });
            this.getBatches();
            this.data.manufacture.forEach((x, idx) => {
              this.rawItemsOriginalQuantity.push(x.quantity);
              x.quantity = this.viewData.products[idx].quantity;
            });
            let cloneAdditiondata = [];
            if (this.data.packagingCost && this.data.packagingCost != 0) {
              cloneAdditiondata.push({
                charge: 'Packaging Charges', amount: this.data.packagingCost, description: this.data.packagingChargesDescription
              });
            }
            if (this.data.electricityCost && this.data.electricityCost != 0) {
              cloneAdditiondata.push({
                charge: 'Electricity Charges', amount: this.data.electricityCost, description: this.data.electricityChargesDescription
              });
            }
            if (this.data.labourCost && this.data.labourCost != 0) {
              cloneAdditiondata.push({
                charge: 'Labour Charges', amount: this.data.labourCost, description: this.data.labourChargesDescription
              });
            }
            if (this.data.logisticsCost && this.data.logisticsCost != 0) {
              cloneAdditiondata.push({
                charge: 'Logistics Charges', amount: this.data.logisticsCost, description: this.data.logisticsChargesDescription
              });
            }
            if (this.data.otherCost && this.data.otherCost != 0) {
              cloneAdditiondata.push({
                charge: 'Other Charges', amount: this.data.otherCost, description: this.data.otherChargesDescription
              });
            }
            this.data.packagingCost = this.viewData.packagingCost;
            this.data.electricityCost = this.viewData.electricityCost;
            this.data.packagingCost = this.viewData.packagingCost;
            this.data.labourCost = this.viewData.labourCost;
            this.data.logisticsCost = this.viewData.logisticsCost;
            this.data.otherCost = this.viewData.otherCost;
            this.data.packagingChargesDescription = this.viewData.packagingChargesDescription;
            this.data.electricityChargesDescription = this.viewData.electricityChargesDescription;
            this.data.packagingChargesDescription = this.viewData.packagingChargesDescription;
            this.data.labourChargesDescription = this.viewData.labourChargesDescription;
            this.data.labourChargesDescription = this.viewData.logisticsChargesDescription;
            this.data.otherChargesDescription = this.viewData.otherChargesDescription;
            this.additionCostOriginalQuantity = JSON.parse(JSON.stringify(cloneAdditiondata));
            this.batchesAndWarehouseDetails = response.data.productBatch;
            this.details.batchName = this.viewData.batchName;
            this.details.sourceWarehouseName = this.viewData.sourceWarehouseName;
            this.batchesAndWarehouseDetails!.forEach(x => {
              this.batches.push(x.batchName);
            });
            this.batches = [...new Set(this.batches)];
            const item = this.itemService.getAllItems().subscribe(res => {
              this.items = res.data;
              this.items = this.items.filter(obj => obj.type !== "Service" && obj.name !== "Wastage" && obj.name !== 'Scrap' && obj.id != parseInt(id, 10));
              for (let i = 0; i < this.data.manufacture.length; i++) {
                this.items = this.items.filter(obj => obj.id !== this.data.manufacture[i].id);
              }
              this.byProduct.forEach((x, idx) => {
                x.sourceWarehouseName = x.warehouseName;
                if (idx > 1) {
                  this.getBatchforByProduct(x.productName, idx);
                }
              });
              item.unsubscribe();
            });
             if (this.type != 'edit') {
              this.data.quantity = 1;
            }
            this.cloneData = response.data;
            if (this.additionalCost.length == 5) {
              this.isAddAdditionCostButtonVisible = false;
            }
            sub.unsubscribe();
          });
          hub.unsubscribe();
        });

        
        // const hub = this.itemGroupService.getManufacturedProductById(parseInt(id)).subscribe(res => {
        //   console.log("res.data.products",res.data.products);
        //   this.data = res.data;
        //   productId = res.data.productId;
        //   this.viewData = res.data;
        //   this.details.batchName = this.viewData.batchName
        //   this.data.manufacture = this.viewData.products;
        //   this.byProduct = this.viewData.byProducts;
        //   this.byProduct[0].batches = ['DEFAULT']
        //   this.byProduct[1].batches = ['DEFAULT']
        //   this.byProduct.forEach(x => {
        //     x.sourceWarehouseName = x.warehouseName;
        //   });
        //   this.additionalCost = [];
        //   if (this.viewData.packagingCost && this.viewData.packagingCost != 0) {
        //     this.additionalCost.push({
        //       charge: 'Packaging Charges', amount: this.viewData.packagingCost, description: this.viewData.packagingChargesDescription
        //     })
        //   }
        //   if (this.viewData.electricityCost && this.viewData.electricityCost != 0) {
        //     this.additionalCost.push({
        //       charge: 'Electricity Charges', amount: this.viewData.electricityCost, description: this.viewData.electricityChargesDescription
        //     })
        //   }
        //   if (this.viewData.labourCost && this.viewData.labourCost != 0) {
        //     this.additionalCost.push({
        //       charge: 'Labour Charges', amount: this.viewData.labourCost, description: this.viewData.labourChargesDescription
        //     })
        //   }
        //   if (this.viewData.logisticsCost && this.viewData.logisticsCost != 0) {
        //     this.additionalCost.push({
        //       charge: 'Logistics Charges', amount: this.viewData.logisticsCost, description: this.viewData.logisticsChargesDescription
        //     })
        //   }
        //   if (this.viewData.otherCost && this.viewData.otherCost != 0) {
        //     this.additionalCost.push({
        //       charge: 'Other Charges', amount: this.viewData.otherCost, description: this.viewData.otherChargesDescription
        //     })
        //   }
        //   const sub = this.itemGroupService.getProductById(productId).subscribe(response => {
        //     // this.data = response.data;
        //     this.data.quantity = this.viewData.quantity;
        //     this.data.manufacture = this.viewData.products;
        //     this.getBatches();
        //     this.data.manufacture.forEach((x, idx) => {
        //       this.rawItemsOriginalQuantity.push(x.quantity);
        //       x.quantity = this.viewData.products[idx].quantity;
        //     });
        //     let cloneAdditiondata = [];
        //     if (this.data.packagingCost && this.data.packagingCost != 0) {
        //       cloneAdditiondata.push({
        //         charge: 'Packaging Charges', amount: this.data.packagingCost, description: this.data.packagingChargesDescription
        //       });
        //     }
        //     if (this.data.electricityCost && this.data.electricityCost != 0) {        
        //       cloneAdditiondata.push({
        //         charge: 'Electricity Charges', amount: this.data.electricityCost, description: this.data.electricityChargesDescription
        //       });
        //     }        
        //     if (this.data.labourCost && this.data.labourCost != 0) {            
        //       cloneAdditiondata.push({
        //         charge: 'Labour Charges', amount: this.data.labourCost, description: this.data.labourChargesDescription
        //       });
        //     }            
        //     if (this.data.logisticsCost && this.data.logisticsCost != 0) {            
        //       cloneAdditiondata.push({
        //         charge: 'Logistics Charges', amount: this.data.logisticsCost, description: this.data.logisticsChargesDescription
        //       });
        //     }            
        //     if (this.data.otherCost && this.data.otherCost != 0) {            
        //       cloneAdditiondata.push({
        //         charge: 'Other Charges', amount: this.data.otherCost, description: this.data.otherChargesDescription
        //       });
        //     }            
        //     this.additionCostOriginalQuantity = JSON.parse(JSON.stringify(cloneAdditiondata));
        //     this.batchesAndWarehouseDetails = response.data.productBatch;
        //     this.details.batchName = this.viewData.batchName;
        //     this.details.sourceWarehouseName = this.viewData.sourceWarehouseName;
        //     this.batchesAndWarehouseDetails!.forEach(x => {
        //       this.batches.push(x.batchName);
        //     });
        //     this.batches = [...new Set(this.batches)];           
        //     const item = this.itemService.getAllItems().subscribe(res => {
        //       this.items = res.data;
        //       this.items = this.items.filter(obj => obj.type !== "Service" && obj.name !== "Wastage" && obj.name !== 'Scrap' && obj.id != parseInt(id, 10));
        //       for (let i = 0; i < this.data.manufacture.length; i++) {
        //         this.items = this.items.filter(obj => obj.id !== this.data.manufacture[i].id);
        //       }
        //       item.unsubscribe();
        //     });
        //     if (this.type != 'edit') {
        //       this.data.quantity = 1;
        //     }
        //     this.cloneData = response.data;
        //     if (this.additionalCost.length == 5) {
        //       this.isAddAdditionCostButtonVisible = false;
        //     }
        //     sub.unsubscribe();
        //     hub.unsubscribe();            
        //   });
        // });       
      } else {
           this.details.productId = parseInt(id, 10);
           this.itemService.processing(true)
           const sub = this.itemGroupService.getProductById(parseInt(id, 10)).subscribe(res => {
             this.data = res.data;
             this.batchesAndWarehouseDetails = res.data.productBatch;
             this.batchesAndWarehouseDetails.forEach(x => {
               this.batches.push(x.batchName);
             });
             this.batches = [...new Set(this.batches)];
             this.details.batchName = this.batches[0];             
          // this.getWarehouses(this.batches[0]);
             this.getBatches();
             this.data.manufacture.forEach(x => {
               this.rawItemsOriginalQuantity.push(x.quantity);
             });
             const item = this.itemService.getAllItems().subscribe(res => {
               this.items = res.data;
               this.items = this.items.filter(obj => obj.type !== "Service" && obj.name !== "Wastage" && obj.name !== 'Scrap' && obj.id != parseInt(id, 10));
               for (let i = 0; i < this.data.manufacture.length; i++) {
                 this.items = this.items.filter(obj => obj.id !== this.data.manufacture[i].id);
               }
               item.unsubscribe();
             });
          
          this.data.quantity = 1;
          this.cloneData = res.data;
          this.additionalCost = [];
          if (this.data.packagingCost != 0) {
            this.additionalCost.push({
              charge: 'Packaging Charges', amount: this.data.packagingCost,description:this.data.packagingChargesDescription
            })
          }
          if (this.data.electricityCost != 0) {
            this.additionalCost.push({
              charge: 'Electricity Charges', amount: this.data.electricityCost,description:this.data.electricityChargesDescription
            })
          }
          if (this.data.labourCost != 0) {
            this.additionalCost.push({
              charge: 'Labour Charges', amount: this.data.labourCost,description:this.data.labourChargesDescription
            })
          }
          if (this.data.logisticsCost != 0) {
            this.additionalCost.push({
              charge: 'Logistics Charges', amount: this.data.logisticsCost,description:this.data.logisticsChargesDescription
            })
          }
          if (this.data.otherCost != 0) {
            this.additionalCost.push({
              charge: 'Other Charges', amount: this.data.otherCost,description:this.data.otherChargesDescription
            })
          }
          this.additionCostOriginalQuantity = JSON.parse(JSON.stringify(this.additionalCost));
          if (this.additionalCost.length == 5) {
            this.isAddAdditionCostButtonVisible = false;
             }             
          sub.unsubscribe();
        });
      }
   
    });
  }

  getAllWarehouses():any {
    const ware = this.warehouseService.getAllWarehouses().subscribe(res => {
      this.allWarehouses = res.data;
      this.byProduct.forEach((x, idx) => {
        if (idx > 1) {
          x.sourceWarehouseName = this.allWarehouses[0];
        }
        if (!this.details.sourceWarehouseName) {
          this.details.sourceWarehouseName = this.allWarehouses[0].name;
        }
      });
      ware.unsubscribe();
    });
  }

  setOriginalQuantity() {
    for (let i = 0; i < this.data.manufacture.length; i++){
      this.data.manufacture[i].quantity = this.rawItemsOriginalQuantity[i] * this.data.quantity;
    }

    this.additionalCost.forEach((x,i) => {
      x.amount =  this.additionCostOriginalQuantity[i].amount * (this.data.quantity > 0 ? this.data.quantity : 0);
    });

  }

  getTotalEstimatedCostOfManufacturing(): number {
    return this.data.manufacture.reduce((total, manufactureAmt) => {
      return (manufactureAmt.quantity || 0) * (manufactureAmt.pricePerUnit || 0) * (this.data.quantity || 0) + total;
    }, 0);
  }

  getTotalAdditionalCost(): number {
    let amount = 0;
    this.additionalCost.forEach(x => {
      amount = x.amount + amount;
    });
    return amount ? amount : 0;
  }

  // getWarehouses(batch: string) {
  //   this.warehouses = [];
  //   this.batchesAndWarehouseDetails.forEach(x => {
  //     if (x.batchName == batch) {
  //       this.warehouses.push(x.warehouseName);
  //     }
  //   });
  //   this.warehouses = [...new Set(this.warehouses)];
  // }


  calculateTotal() {
    this.data.packagingCost = 0;
    this.data.electricityCost = 0;
    this.data.labourCost = 0;
    this.data.logisticsCost = 0;
    this.data.otherCost = 0;

    this.additionalCost.forEach(row => {
      switch (row.charge) {
        case 'Packaging Charges':
          this.data.packagingCost += row.amount;
          this.data.packagingChargesDescription = row.description;
          break;
        case 'Electricity Charges':
          this.data.electricityCost += row.amount;
          this.data.electricityChargesDescription = row.description;
          break;
        case 'Labour Charges':
          this.data.labourCost += row.amount;
          this.data.labourChargesDescription = row.description;
          break;
        case 'Logistics Charges':
          this.data.logisticsCost += row.amount;
          this.data.logisticsChargesDescription = row.description;
          break;
        case 'Other Charges':
          this.data.otherCost += row.amount;
          this.data.otherChargesDescription = row.description;
          break;
      }
    });
  }

  setWareHouseForByProduct(index: number, e: any) {   
    this.byProduct[index].sourceWarehouseName = name;
  }

  onSubmit() {    
    if (this.data.quantity == null || this.data.quantity == 0) {
      this.toastr.error("Enter a vaild quantity to manufacture item");
      return;
    }
    for (let i = 0; i < this.data.manufacture.length; i++){
      if (this.data.manufacture[i].quantity == null || this.data.manufacture[i].quantity == 0) {
        this.toastr.error("Enter Quantity For Raw material " + this.data.manufacture[i].name);
        return;
      }
    }
    for (let i = 0; i < this.byProduct.length; i++){
      if ((this.byProduct[i].quantity == null || this.byProduct[i].quantity == 0) && this.byProduct[i].productName != 'Wastage'
        && this.byProduct[i].productName != 'Scrap') {
        this.toastr.error("Enter Quantity For By Product " + this.byProduct[i].productName);
        return;
      }
    }
    if (this.byProduct[0].quantity == null) {
      this.byProduct[0].quantity = 0;
    }
    if (this.byProduct[1].quantity == null) {
      this.byProduct[1].quantity = 0;
    }
    this.RequestData = [];
    this.RequestData.push({
      productId: this.data.id,
      quantity: this.data.quantity,
      productStockType: 'ADD_ADJUSTMENT',
      asOfDate: this.date
    });
    this.details.productStockType = 'ADD_ADJUSTMENT';
    this.details.asOfDate = this.date;
    this.details.quantity = this.data.quantity;
    this.details.products = [];
    this.details.packagingCost = this.data.packagingCost;
    this.details.electricityCost = this.data.electricityCost;
    this.details.otherCost = this.data.otherCost;
    this.details.labourCost = this.data.labourCost;
    this.details.logisticsCost = this.data.logisticsCost;
    this.details.packagingChargesDescription = this.data.packagingChargesDescription;
    this.details.electricityChargesDescription = this.data.electricityChargesDescription;
    this.details.otherChargesDescription = this.data.otherChargesDescription;
    this.details.labourChargesDescription = this.data.labourChargesDescription;
    this.details.logisticsChargesDescription = this.data.logisticsChargesDescription;
    if (this.details.packagingCost == 0) {
      this.details.packagingCost = null;
    }
    if (this.details.electricityCost == 0) {
      this.details.electricityCost = null;
    }
    if (this.details.logisticsCost==0) {
      this.details.logisticsCost = null;
    }
    if (this.details.labourCost == 0) {
      this.details.labourCost = null;
    }
    if (this.details.otherCost == 0) {
      this.details.otherCost = null;
    }
    

    this.data.manufacture.forEach(x => {
      this.details.products.push({
        id: x.id,
        productId:x.id,
        batchName: x.batchName,
        sourceWarehouseName: x.sourceWarehouseName,
        quantity: x.quantity,
        pricePerUnit:x.pricePerUnit
      });
    });
    
    this.details.byProducts = [];
    
    this.byProduct.forEach(x => {
      this.details.byProducts.push({
        id: x.id,
        productName: x.productName,
        batchName: x.batchName,
        warehouseName: x.sourceWarehouseName,
        quantity: x.quantity,
        atPrice: x.atPrice != undefined ? x.atPrice : 0
      });
    });
    this.details.productId = this.data.id;
    let sendData: any[] = [];
    sendData[0] = this.details; 
    
    if (this.type == 'edit') {
      this.details.id = this.viewData.id;        
        const sub = this.itemService.updateManufacturing(sendData).subscribe(res => {
        if (res.code == 200) {
          this.router.navigateByUrl('/app/item/manufacturing');
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    } else { 
      const sub = this.itemService.updateAdjustItem(sendData).subscribe(res => {
        if (res.code == 200) {
          this.router.navigateByUrl('/app/item/manufacturing');
          this.toastr.success(res.message);
        } else {
          this.toastr.error(res.message);
        }
        sub.unsubscribe();
      });
    }
  }

  quantity() {
    this.data.manufacture = this.data.manufacture.map(element => {
      return {
        id: element.id,
        name: element.name,
        pricePerUnit: element.pricePerUnit * this.data.quantity,
        quantity: element.quantity * this.data.quantity
      };
    });
  }

  getBatches() {
    this.data.manufacture.forEach((x, idx) => {
      x.batches = [];
      const sub = this.itemGroupService.getProductById(x.id?x.id:x.productId).subscribe(res => {
        if (res.code == 200) {
          x.batchesAndWarehouseDetails = res.data.productBatch;
          x.batchesAndWarehouseDetails.forEach(res => {
          x.batches.push(res.batchName);
        });
          x.batches = [...new Set(x.batches)];
          if (this.type!='edit') {
            x.batchName = x.batches[0];
          }
          this.getWarehouseForRawMaterial(x.batchName,x.batchesAndWarehouseDetails,idx)
       }
      });
    });
  }

  removeByproduct(idx:number) {
    this.byProduct.splice(idx,1)
  }

  getWarehouseForRawMaterial(batch: string, productAndBatches: Array<any>, idx: number) {
    this.data.manufacture[idx].warehouses = [];
    productAndBatches.forEach(x => {
      if (x.batchName == batch) {
        this.data.manufacture[idx].warehouses.push(x.warehouseName);
      }
      this.data.manufacture[idx].warehouses = [...new Set(this.data.manufacture[idx].warehouses)];
      this.data.manufacture[idx].sourceWarehouseName = this.data.manufacture[idx].warehouses[0];
    });
  }

  addByProduct() {
    this.byProduct.push({});
  }

  getBatchforByProduct(itemName: string, idx: number,getData?:boolean) { 
    let item = this.items.filter(x => x.name == itemName);
    const sub = this.itemGroupService.getProductById(item[0].id!).subscribe(res => {
      this.byProduct[idx].data = res.data.productBatch;
      let batches:any[]=[]
      this.byProduct[idx].data.forEach((x: any) => {
            batches.push(x.batchName);
      });    
      this.byProduct[idx].batches = batches;
      this.byProduct[idx].batches = [...new Set(this.byProduct[idx].batches)]; 
      if (this.type != 'edit' || getData==true) { 
        this.byProduct[idx].batchName = this.byProduct[idx].batches[0];
      }
      this.getWarehouseforByProduct(this.byProduct[idx].batchName, this.byProduct[idx].data, idx);
      sub.unsubscribe();
    });
  }

  getWarehouseforByProduct(batch: string, productBatch: Array<any>, idx: number) {      
    this.byProduct[idx].warehouses = [];
    productBatch.forEach(x => {
      if (x.batchName == batch) {
        this.byProduct[idx].warehouses.push(x.warehouseName);
      }
    });    
    this.byProduct[idx].warehouses = [...new Set(this.byProduct[idx].warehouses)];
    if (this.type != 'edit') {
      this.byProduct[idx].sourceWarehouseName = this.byProduct[idx].warehouses[0];
    }
  }

  addAdditionalCost() {    
    this.additionalCost.push({
      chargesArray:[]
    });
      if (this.additionalCost.length == 5) {
      this.isAddAdditionCostButtonVisible = false;
    }
  }

  removeAdditionalCost(idx: number) {
    this.data.packagingCost = 0;
    this.data.electricityCost = 0;
    this.data.labourCost = 0;
    this.data.logisticsCost = 0;
    this.data.otherCost = 0;
     this.additionalCost.forEach(row => {
      switch (row.charge) {
        case 'Packaging Charges':
          this.data.packagingCost = null;
          break;
        case 'Electricity Charges':
          this.data.electricityCost =null;
          break;
        case 'Labour Charges':
          this.data.labourCost = null;
          break;
        case 'Logistics Charges':
          this.data.logisticsCost = null;
          break;
        case 'Other Charges':
          this.data.otherCost = null;
          break;
      }
    });
    this.additionalCost.splice(idx, 1);    
    if (this.additionalCost.length < 5) {
      this.isAddAdditionCostButtonVisible = true;
    }
  }

  getOptions(idx: number): Array<string> {
    this.data.packagingCost = 0;
    this.data.electricityCost = 0;
    this.data.labourCost = 0;
    this.data.logisticsCost = 0;
    this.data.otherCost = 0;
     this.additionalCost.forEach(row => {
      switch (row.charge) {
        case 'Packaging Charges':
          this.data.packagingCost += row.amount;
          break;
        case 'Electricity Charges':
          this.data.electricityCost += row.amount;
          break;
        case 'Labour Charges':
          this.data.labourCost += row.amount;
          break;
        case 'Logistics Charges':
          this.data.logisticsCost += row.amount;
          break;
        case 'Other Charges':
          this.data.otherCost += row.amount;
          break;
      }
    });
    let selectedCharges = this.additionalCost?.map(x => x.charge) ?? [];
    return ['Select',...this.chargeOptions.filter(x => !selectedCharges.includes(x) ||
      (this.additionalCost[idx]?.charge && x == this.additionalCost[idx].charge))];
    
  }
}
