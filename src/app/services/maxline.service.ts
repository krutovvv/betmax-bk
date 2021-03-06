import { Injectable } from '@angular/core';
import football from '../data/maxline/football.json';
import hockey from '../data/maxline/hockey.json';
import tableTennis from '../data/maxline/table-tennis.json';
import tennis from '../data/maxline/tennis.json';
import volleyball from '../data/maxline/volleyball.json';
import basketball from '../data/maxline/basketball.json';
import cs from '../data/maxline/cs.json';
import { ParserService } from '../../../projects/parser/src/lib/parser.service';
import { CheckService } from '../../../projects/parser/src/lib/check.service';

@Injectable({
  providedIn: 'root'
})
export class MaxlineService {
  constructor(private checkService: CheckService, private parserService: ParserService) { }

  // var evObj = document.createEvent('Events');
  // evObj.initEvent('click', true, false);
  // var result = [];
  // document.querySelectorAll('.events-line .additional .f-value').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj), setTimeout(() => {window.result.push(document.querySelector('#line-coupon > ul > li').innerHTML); console.log(index)}, 500)}, index * 1000)});

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
    const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
    const title = clear.replace(/.*<div[^>]*class="[^"]*eventName[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1');
    const team2 = title.replace(/.* +- +(.*)$/, '$1').trim();
    const team1 = title.replace(team2, '').trim().replace(/-$/, '').trim();
    const betString = clear.replace(/.*<div[^>]*class="[^"]*betName[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1').trim();
    const betValue = clear.replace(/.*<div[^>]*class="[^"]*betValue[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1').trim();
    const betParse = this.parserService.parser(betString, team1, team2, sport);
    const betCheck = this.checkService.check(betParse);

    return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
  }
}
