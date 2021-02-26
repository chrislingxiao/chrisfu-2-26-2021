import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  exports: [NzCardModule, NzGridModule, NzTableModule, NzSelectModule],
})
export class NgZorroModule {}
