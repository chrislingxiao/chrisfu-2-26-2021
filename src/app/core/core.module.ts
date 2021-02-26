import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalErrorHandler } from './errors/global-error-handler';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
})
export class CoreModule {}
