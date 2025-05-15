import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      progressBar: true,
      preventDuplicates: true
    }),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    ToastrModule,
    TooltipModule,
    PopoverModule,
    ModalModule,
    BsDatepickerModule,
  ],
  providers: [],
})
export class NgxBootstrapModule { }
