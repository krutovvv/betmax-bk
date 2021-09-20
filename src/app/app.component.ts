import { Component, OnInit } from '@angular/core';
import { TwentytwobetService } from './services/twentytwobet.service';
import { LootService } from './services/loot.service';
import { MaxlineService } from './services/maxline.service';
import { FavbetService } from './services/favbet.service';
import { Bet365Service } from './services/bet365.service';
import { TwentybetService } from './services/twentybet.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public table = [];

  constructor(
    private twentytwobetService: TwentytwobetService,
    private lootService: LootService,
    private maxlineService: MaxlineService,
    private favbetService: FavbetService,
    private bet365Service: Bet365Service,
    private twentybetService: TwentybetService
  ) {
  }

  ngOnInit() {
    const twentytwobetTable = this.twentytwobetService.table();
    const lootTable = this.lootService.table();
    const maxlineTable = this.maxlineService.table();
    const favbetTable = this.favbetService.table();
    const bet365Table = this.bet365Service.table();
    const twentybetTable = this.twentybetService.table();

    this.table = [...twentytwobetTable, ...lootTable, ...maxlineTable, ...favbetTable, ...bet365Table, ...twentybetTable];
    // this.table = twentytwobetTable;
  }
}
