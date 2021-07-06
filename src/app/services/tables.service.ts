import { Injectable } from '@angular/core';
import { MaxlineService } from './maxline.service';
import { FavbetService } from './favbet.service';
import maxline_football from '../data/maxline/football.json';
import maxline_football_2 from '../data/maxline/football2.json';
import maxline_hockey from '../data/maxline/hockey.json';
import maxline_table from '../data/maxline/table-tennis.json';
import maxline_tennis from '../data/maxline/tennis.json';
import maxline_volleyball from '../data/maxline/volleyball.json';
import favbet_football from '../data/favbet/football.json';
import maxline_basketball from '../data/maxline/basketball.json';
import maxline_cs from '../data/maxline/cs.json';

@Injectable({
  providedIn: 'root'
})
export class TablesService {

  constructor(private maxlineService: MaxlineService, private favbetService: FavbetService) { }

  public favbet() {
    const table = [];
    for (let i = 0; i < favbet_football.length; i++) {
      const result = this.favbetService.favbet(favbet_football[i].html, 42);
      table.push([`Футбол`, `${favbet_football[i].params.type || '-'} / ${favbet_football[i].params.time || '-'} / ${favbet_football[i].params.value || '-'}`, result.bet, result.check ? result.check.name : '', favbet_football[i]?.['test'], favbet_football[i]?.['test'] ? result.bet === favbet_football[i]?.['test'] : null]);
    }
    return table;
  }

  public maxline() {
    const table = [];
    for (let i = 0; i < maxline_football.length; i++) {
      const result = this.maxlineService.maxline(maxline_football[i].html, 42);
      table.push([`Футбол: ${result.team1}/${result.team2}`, maxline_football[i].type, result.bet, result.check ? result.check.name : '', maxline_football[i]?.['test'], (maxline_football[i]?.['test'] || maxline_football[i]?.['test'] === '') ? (result.bet || '') === maxline_football[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_football_2.length; i++) {
      const result = this.maxlineService.maxline(maxline_football_2[i].html, 42);
      table.push([`Футбол: ${result.team1}/${result.team2}`, maxline_football_2[i].type, result.bet, result.check ? result.check.name : '', maxline_football_2[i]?.['test'], (maxline_football_2[i]?.['test'] || maxline_football_2[i]?.['test'] === '') ? (result.bet || '') === maxline_football_2[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_hockey.length; i++) {
      const result = this.maxlineService.maxline(maxline_hockey[i].html, 35);
      table.push([`Хокей: ${result.team1}/${result.team2}`, maxline_hockey[i].type, result.bet, result.check ? result.check.name : '', maxline_hockey[i]?.['test'], (maxline_hockey[i]?.['test'] || maxline_hockey[i]?.['test'] === '') ? (result.bet || '') === maxline_hockey[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_table.length; i++) {
      const result = this.maxlineService.maxline(maxline_table[i].html, 24);
      table.push([`Настольный тенис: ${result.team1}/${result.team2}`, maxline_table[i].type, result.bet, result.check ? result.check.name : '', maxline_table[i]?.['test'], (maxline_table[i]?.['test'] || maxline_table[i]?.['test'] === '') ? (result.bet || '') === maxline_table[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_tennis.length; i++) {
      const result = this.maxlineService.maxline(maxline_tennis[i].html, 33);
      table.push([`Тенис: ${result.team1}/${result.team2}`, maxline_tennis[i].type, result.bet, result.check ? result.check.name : '', maxline_tennis[i]?.['test'], (maxline_tennis[i]?.['test'] || maxline_tennis[i]?.['test'] === '') ? (result.bet || '') === maxline_tennis[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_volleyball.length; i++) {
      const result = this.maxlineService.maxline(maxline_volleyball[i].html, 27);
      table.push([`Волейбол: ${result.team1}/${result.team2}`, maxline_volleyball[i].type, result.bet, result.check ? result.check.name : '', maxline_volleyball[i]?.['test'], (maxline_volleyball[i]?.['test'] || maxline_volleyball[i]?.['test'] === '') ? (result.bet || '') === maxline_volleyball[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_basketball.length; i++) {
      const result = this.maxlineService.maxline(maxline_basketball[i].html, 23);
      table.push([`Баскетбол: ${result.team1}/${result.team2}`, maxline_basketball[i].type, result.bet, result.check ? result.check.name : '', maxline_basketball[i]?.['test'], (maxline_basketball[i]?.['test'] || maxline_basketball[i]?.['test'] === '') ? (result.bet || '') === maxline_basketball[i]?.['test'] : null]);
    }
    for (let i = 0; i < maxline_cs.length; i++) {
      const result = this.maxlineService.maxline(maxline_cs[i].html, 36);
      table.push([`CS: ${result.team1}/${result.team2}`, maxline_cs[i].type, result.bet, result.check ? result.check.name : '', maxline_cs[i]?.['test'], (maxline_cs[i]?.['test'] || maxline_cs[i]?.['test'] === '') ? (result.bet || '') === maxline_cs[i]?.['test'] : null]);
    }

    return table;
  }
}
