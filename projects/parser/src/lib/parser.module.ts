import { NgModule } from '@angular/core';
import { ParserService } from './parser.service';
import { TranslateService } from './translate.service';

@NgModule({
  providers: [
    ParserService,
    TranslateService
  ]
})
export class ParserModule { }
