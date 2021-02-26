import { NgModule } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  exports: [NzCardModule, NzGridModule, NzTableModule, NzSelectModule, NzMessageModule],
})
export class NgZorroModule {}
