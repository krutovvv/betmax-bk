import { Injectable } from '@angular/core';
import football from '../data/twentybet/football.json';
import hockey from '../data/twentybet/hockey.json';
import tableTennis from '../data/twentybet/table-tennis.json';
import tennis from '../data/twentybet/tennis.json';
import volleyball from '../data/twentybet/volleyball.json';
import basketball from '../data/twentybet/basketball.json';
import cs from '../data/twentybet/cs.json';
import { ParserService } from '../../../projects/parser/src/lib/parser.service';
import { CheckService } from '../../../projects/parser/src/lib/check.service';

@Injectable({
  providedIn: 'root'
})
export class TwentybetService {

  constructor(private checkService: CheckService, private parserService: ParserService) { }

  // var evObj = document.createEvent('Events');
  // evObj.initEvent('click', true, false);
  // var result = [];
  // document.querySelectorAll('.event-table-additional__col').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj), setTimeout(() => {window.result.push(document.querySelector('.coupon-list__item').innerHTML); console.log(index)}, 500)}, index * 1000)});

  public table() {
    const write = [];
    const table = [];
    for (let i = 0; i < football.length; i++) {
      const result = this.render(football[i].html, 'football');
      write.push({team1: result.team1, team2: result.team2, type: football[i].type, coff: result.value, html: football[i].html, test: football[i]?.['test'] || result.bet});
      table.push([`Футбол: ${result.team1}/${result.team2}`, football[i].type, result.bet, result.check ? result.check.name : '', football[i]?.['test'], (football[i]?.['test'] || football[i]?.['test'] === '') ? (result.bet || '') === football[i]?.['test'] : null]);
    }
    for (let i = 0; i < hockey.length; i++) {
      const result = this.render(hockey[i].html, 'hockey');
      write.push({team1: result.team1, team2: result.team2, type: hockey[i].type, coff: result.value, html: hockey[i].html, test: hockey[i]?.['test'] || result.bet});
      table.push([`Хокей: ${result.team1}/${result.team2}`, hockey[i].type, result.bet, result.check ? result.check.name : '', hockey[i]?.['test'], (hockey[i]?.['test'] || hockey[i]?.['test'] === '') ? (result.bet || '') === hockey[i]?.['test'] : null]);
    }
    for (let i = 0; i < tableTennis.length; i++) {
      const result = this.render(tableTennis[i].html, 'table-tennis');
      write.push({team1: result.team1, team2: result.team2, type: tableTennis[i].type, coff: result.value, html: tableTennis[i].html, test: tableTennis[i]?.['test'] || result.bet});
      table.push([`Настольный тенис: ${result.team1}/${result.team2}`, tableTennis[i].type, result.bet, result.check ? result.check.name : '', tableTennis[i]?.['test'], (tableTennis[i]?.['test'] || tableTennis[i]?.['test'] === '') ? (result.bet || '') === tableTennis[i]?.['test'] : null]);
    }
    for (let i = 0; i < tennis.length; i++) {
      const result = this.render(tennis[i].html, 'tennis');
      write.push({team1: result.team1, team2: result.team2, type: tennis[i].type, coff: result.value, html: tennis[i].html, test: tennis[i]?.['test'] || result.bet});
      table.push([`Тенис: ${result.team1}/${result.team2}`, tennis[i].type, result.bet, result.check ? result.check.name : '', tennis[i]?.['test'], (tennis[i]?.['test'] || tennis[i]?.['test'] === '') ? (result.bet || '') === tennis[i]?.['test'] : null]);
    }
    for (let i = 0; i < volleyball.length; i++) {
      const result = this.render(volleyball[i].html, 'volleyball');
      write.push({team1: result.team1, team2: result.team2, type: volleyball[i].type, coff: result.value, html: volleyball[i].html, test: volleyball[i]?.['test'] || result.bet});
      table.push([`Волейбол: ${result.team1}/${result.team2}`, volleyball[i].type, result.bet, result.check ? result.check.name : '', volleyball[i]?.['test'], (volleyball[i]?.['test'] || volleyball[i]?.['test'] === '') ? (result.bet || '') === volleyball[i]?.['test'] : null]);
    }
    for (let i = 0; i < basketball.length; i++) {
      const result = this.render(basketball[i].html, 'basketball');
      write.push({team1: result.team1, team2: result.team2, type: basketball[i].type, coff: result.value, html: basketball[i].html, test: basketball[i]?.['test'] || result.bet});
      table.push([`Баскетбол: ${result.team1}/${result.team2}`, basketball[i].type, result.bet, result.check ? result.check.name : '', basketball[i]?.['test'], (basketball[i]?.['test'] || basketball[i]?.['test'] === '') ? (result.bet || '') === basketball[i]?.['test'] : null]);
    }
    for (let i = 0; i < cs.length; i++) {
      const result = this.render(cs[i].html, 'cs');
      write.push({team1: result.team1, team2: result.team2, type: cs[i].type, coff: result.value, html: cs[i].html, test: cs[i]?.['test'] || result.bet});
      table.push([`CS: ${result.team1}/${result.team2}`, cs[i].type, result.bet, result.check ? result.check.name : '', cs[i]?.['test'], (cs[i]?.['test'] || cs[i]?.['test'] === '') ? (result.bet || '') === cs[i]?.['test'] : null]);
    }

    // console.log(JSON.stringify(write, null, 2));
    return table;
  }

  public table_test() {
    const table = [];
    for (let i = 0; i < football.length; i++) {
      const result = this.render(football[i].html, 'football');
      const check = this.checkService.check(football[i]?.['test']);
      table.push([`Футбол: ${result.team1}/${result.team2}`, football[i].type, football[i]?.['test'], check ? check.name : '', football[i]?.['test'], true]);
    }
    for (let i = 0; i < hockey.length; i++) {
      const result = this.render(hockey[i].html, 'hockey');
      const check = this.checkService.check(hockey[i]?.['test']);
      table.push([`Хокей: ${result.team1}/${result.team2}`, hockey[i].type, hockey[i]?.['test'], check ? check.name : '', hockey[i]?.['test'], true]);
    }
    for (let i = 0; i < tableTennis.length; i++) {
      const result = this.render(tableTennis[i].html, 'table-tennis');
      const check = this.checkService.check(tableTennis[i]?.['test']);
      table.push([`Настольный тенис: ${result.team1}/${result.team2}`, tableTennis[i].type, tableTennis[i]?.['test'], check ? check.name : '', tableTennis[i]?.['test'], true]);
    }
    for (let i = 0; i < tennis.length; i++) {
      const result = this.render(tennis[i].html, 'tennis');
      const check = this.checkService.check(tennis[i]?.['test']);
      table.push([`Тенис: ${result.team1}/${result.team2}`, tennis[i].type, tennis[i]?.['test'], check ? check.name : '', tennis[i]?.['test'], true]);
    }
    for (let i = 0; i < volleyball.length; i++) {
      const result = this.render(volleyball[i].html, 'volleyball');
      const check = this.checkService.check(volleyball[i]?.['test']);
      table.push([`Волейбол: ${result.team1}/${result.team2}`, volleyball[i].type, volleyball[i]?.['test'], check ? check.name : '', volleyball[i]?.['test'], true]);
    }
    for (let i = 0; i < basketball.length; i++) {
      const result = this.render(basketball[i].html, 'basketball');
      const check = this.checkService.check(basketball[i]?.['test']);
      table.push([`Баскетбол: ${result.team1}/${result.team2}`, basketball[i].type, basketball[i]?.['test'], check ? check.name : '', basketball[i]?.['test'], true]);
    }
    for (let i = 0; i < cs.length; i++) {
      const result = this.render(cs[i].html, 'cs');
      const check = this.checkService.check(cs[i]?.['test']);
      table.push([`CS: ${result.team1}/${result.team2}`, cs[i].type, cs[i]?.['test'], check ? check.name : '', cs[i]?.['test'], true]);
    }
    return table;
  }

  public render(html: string, sport: string): {team1: string, team2: string, bet: string, value: string, check: null | {name: string, parts: string[]}} {
    const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
    const team1 = clear.replace(/.*<div[^>]*class="[^"]*coupon-bet-section__event-teams[^"]*"[^>]*><div[^>]*class="[^"]*coupon-bet-section__event-team[^"]*"[^>]*>([^<]*)<\/div><div[^>]*class="[^"]*coupon-bet-section__event-team[^"]*"[^>]*>.*/gi, '$1');
    const team2 = clear.replace(/.*<div[^>]*class="[^"]*coupon-bet-section__event-team[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1');
    const betString = (clear.replace(/.*<div[^>]*class="[^"]*coupon-bet-section__bet-name[^"]*"[^>]*>([^<]*)<span>.*/gi, '$1').replace(/\&nbsp\;/g, ' ').replace(/\&amp\;/g, '&') + clear.replace(/.*<div[^>]*class="[^"]*coupon-bet-section__bet-name[^"]*"[^>]*>[^<]*<span>([^<]*)<\/span>.*/gi, '$1').replace(/\&nbsp\;/g, ' ').replace(/\&amp\;/g, '&')).trim();
    const betValue = clear.replace(/.*<div[^>]*class="[^"]*coupon-bet-section__bet-value[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1').trim();
    const betParse = this.parserService.parser(betString, team1, team2, sport, 'en');
    const betCheck = this.checkService.check(betParse);

    return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
  }
}
