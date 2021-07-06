import { Injectable } from '@angular/core';
import { CheckService } from './check.service';
import { ParserService } from './parser.service';

@Injectable({
  providedIn: 'root'
})
export class MaxlineService {
  constructor(private checkService: CheckService, private parserService: ParserService) { }

  // var evObj = document.createEvent('Events');
  // evObj.initEvent('click', true, false);
  // var result = [];
  // document.querySelectorAll('.events-line .additional .f-value').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj), setTimeout(() => {window.result.push(document.querySelector('#line-coupon > ul > li').innerHTML); console.log(index)}, 500)}, index * 1000)});

  public maxline(html: string, sport: number): {team1: string, team2: string, bet: string, value: string, check: null | {name: string, parts: string[]}} {
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
