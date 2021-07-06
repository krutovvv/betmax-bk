import { Component, OnInit } from '@angular/core';
import { TablesService } from './services/tables.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public table = [];

  constructor(private tablesService: TablesService) {
  }

  ngOnInit() {
    this.table = this.tablesService.maxline();
  }
}
