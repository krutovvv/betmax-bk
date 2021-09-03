import { Injectable } from '@angular/core';
import { CheckService } from './check.service';
import football from '../data/loot/football.json';
import hockey from '../data/loot/hockey.json';
import tableTennis from '../data/loot/table-tennis.json';
import tennis from '../data/loot/tennis.json';
import volleyball from '../data/loot/volleyball.json';
import basketball from '../data/loot/basketball.json';
import cs from '../data/loot/cs.json';
import { ParserService } from './parser.service';

@Injectable({
  providedIn: 'root'
})
export class LootService {

  constructor(private checkService: CheckService, private parserService: ParserService) { }

  // var evObj = document.createEvent('Events');
  // evObj.initEvent('click', true, false);
  // var result = [];
  // document.querySelectorAll('.outcome').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj); setTimeout(() => {var innerItem = document.querySelector('.coupon-container .bets__item'); window.result.push(innerItem.innerHTML); console.log(index); innerItem.querySelector('.bets__item-close').dispatchEvent(evObj);}, 500)}, index * 1000)});
  // document.querySelectorAll('.mat-expansion-panel-body .cof').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj); setTimeout(() => {var innerItem = document.querySelector('.scrollBet .bet-container'); window.result.push(innerItem.innerHTML); console.log(index); innerItem.querySelector('.close').dispatchEvent(evObj);}, 500)}, index * 1000)});

  public table() {
    const table = [];
    for (let i = 0; i < football.length; i++) {
      const result = this.render(football[i].html, 'football');
      table.push([`Футбол: ${result.team1}/${result.team2}`, football[i].type, result.bet, result.check ? result.check.name : '', football[i]?.['test'], (football[i]?.['test'] || football[i]?.['test'] === '') ? (result.bet || '') === football[i]?.['test'] : null]);
    }
    for (let i = 0; i < hockey.length; i++) {
      const result = this.render(hockey[i].html, 'hockey');
      table.push([`Хокей: ${result.team1}/${result.team2}`, hockey[i].type, result.bet, result.check ? result.check.name : '', hockey[i]?.['test'], (hockey[i]?.['test'] || hockey[i]?.['test'] === '') ? (result.bet || '') === hockey[i]?.['test'] : null]);
    }
    for (let i = 0; i < tableTennis.length; i++) {
      const result = this.render(tableTennis[i].html, 'table-tennis');
      table.push([`Настольный тенис: ${result.team1}/${result.team2}`, tableTennis[i].type, result.bet, result.check ? result.check.name : '', tableTennis[i]?.['test'], (tableTennis[i]?.['test'] || tableTennis[i]?.['test'] === '') ? (result.bet || '') === tableTennis[i]?.['test'] : null]);
    }
    for (let i = 0; i < tennis.length; i++) {
      const result = this.render(tennis[i].html, 'tennis');
      table.push([`Тенис: ${result.team1}/${result.team2}`, tennis[i].type, result.bet, result.check ? result.check.name : '', tennis[i]?.['test'], (tennis[i]?.['test'] || tennis[i]?.['test'] === '') ? (result.bet || '') === tennis[i]?.['test'] : null]);
    }
    for (let i = 0; i < volleyball.length; i++) {
      const result = this.render(volleyball[i].html, 'volleyball');
      table.push([`Волейбол: ${result.team1}/${result.team2}`, volleyball[i].type, result.bet, result.check ? result.check.name : '', volleyball[i]?.['test'], (volleyball[i]?.['test'] || volleyball[i]?.['test'] === '') ? (result.bet || '') === volleyball[i]?.['test'] : null]);
    }
    for (let i = 0; i < basketball.length; i++) {
      const result = this.render(basketball[i].html, 'basketball');
      table.push([`Баскетбол: ${result.team1}/${result.team2}`, basketball[i].type, result.bet, result.check ? result.check.name : '', basketball[i]?.['test'], (basketball[i]?.['test'] || basketball[i]?.['test'] === '') ? (result.bet || '') === basketball[i]?.['test'] : null]);
    }
    for (let i = 0; i < cs.length; i++) {
      const result = this.render(cs[i].html, 'cs');
      table.push([`CS: ${result.team1}/${result.team2}`, cs[i].type, result.bet, result.check ? result.check.name : '', cs[i]?.['test'], (cs[i]?.['test'] || cs[i]?.['test'] === '') ? (result.bet || '') === cs[i]?.['test'] : null]);
    }
    return table;
  }

  public render(html: string, sport: string): {team1: string, team2: string, bet: string, value: string, check: null | {name: string, parts: string[]}} {
    if (sport === 'cs') {
      const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
      const team2 = clear.replace(/.*<span[^>]*class=\"vs[^\"]*"[^\>]*>[^<]*<\/span><span[^>]*class="[^\"]*title[^\"]*"[^\>]*>([^\<]*)<\/span>.*/gi, '$1').trim();
      const team1 = clear.replace(/.*<span[^>]*class="[^\"]*title text-clip[^\"]*"[^\>]*>([^\<]*)<\/span><span[^>]*class=\"vs[^\"]*"[^\>]*>[^<]*<\/span>.*/gi, '$1').trim();
      const betString = clear.replace(/.*<span[^>]*class="[^"]*winner__label ng-tns-c117[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim() + ' - ' + clear.replace(/.*<span[^>]*class="[^"]*text-clip[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betValue = clear.replace(/.*<span[^>]*style="display: inline;"[^>]*class="[^"]*ng-tns-c117-[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betParse = this.parserService.parser(betString, team1, team2, sport);
      const betCheck = this.checkService.check(betParse);

      return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
    } else {
      const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
      const title = clear.replace(/.*<a[^>]*class="[^"]*bets__item-tournament[^"]*"[^>]*>([^<]*)<\/a>.*/gi, '$1');
      const team2 = title.replace(/.* +vs +(.*)$/, '$1').trim();
      const team1 = title.replace(team2, '').trim().replace(/vs$/, '').trim();
      const betString = clear.replace(/.*<a[^>]*class="[^"]*bets__item-name[^"]*"[^>]*>([^<]*)<\/a>.*/gi, '$1').trim();
      const betValue = clear.replace(/.*<span[^>]*class="[^"]*outcome__number[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betParse = this.parserService.parser(betString, team1, team2, sport);
      const betCheck = this.checkService.check(betParse);

      return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
    }
  }
}
