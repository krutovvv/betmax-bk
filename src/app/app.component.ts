import { Component, OnInit } from '@angular/core';
import { TwentytwobetService } from './services/twentytwobet.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public table = [];

  constructor(private twentytwobetService: TwentytwobetService) {
  }

  ngOnInit() {
    this.table = this.twentytwobetService.table();
  }
}
