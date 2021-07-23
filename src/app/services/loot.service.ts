import { Injectable } from '@angular/core';
import { CheckService } from './check.service';
import football from '../data/loot/football.json';
import hockey from '../data/loot/hockey.json';
import tableTennis from '../data/loot/table-tennis.json';
import tennis from '../data/loot/tennis.json';
import volleyball from '../data/loot/volleyball.json';
import basketball from '../data/loot/basketball.json';
import cs from '../data/loot/cs.json';

@Injectable({
  providedIn: 'root'
})
export class LootService {

  constructor(private checkService: CheckService) { }

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
      const betString = clear.replace(/.*<span[^>]*class="[^"]*winner__label ng-tns-c117[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betValue = clear.replace(/.*<span[^>]*style="display: inline;"[^>]*class="[^"]*ng-tns-c117-[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betParse = this.parser(betString, team1, team2, sport);
      const betCheck = this.checkService.check(betParse);

      return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
    } else {
      const clear = html.replace(/<!--.*?-->/gi, '').replace(/\r|\n/gi, '').trim();
      const title = clear.replace(/.*<a[^>]*class="[^"]*bets__item-tournament[^"]*"[^>]*>([^<]*)<\/a>.*/gi, '$1');
      const team2 = title.replace(/.* +vs +(.*)$/, '$1').trim();
      const team1 = title.replace(team2, '').trim().replace(/vs$/, '').trim();
      const betString = clear.replace(/.*<a[^>]*class="[^"]*bets__item-name[^"]*"[^>]*>([^<]*)<\/a>.*/gi, '$1').trim();
      const betValue = clear.replace(/.*<span[^>]*class="[^"]*outcome__number[^"]*"[^>]*>([^<]*)<\/span>.*/gi, '$1').trim();
      const betParse = this.parser(betString, team1, team2, sport);
      const betCheck = this.checkService.check(betParse);

      return {team1: team1, team2: team2, bet: betParse, value: betValue, check: betCheck};
    }
  }

  private parser(betString: string, team1: string, team2: string, sport: string): string {
    let period = '';
    switch (true) {
      case /(1-й|1-м|1-ом|1-я|1|первый) тай|тайм 1/iu.test(betString): period = 'HALF_01'; break;
      case /(2-й|2-м|2-ом|2-я|2|второй) тай|тайм 2/iu.test(betString): period = 'HALF_02'; break;
      case /(1-й|1-м|1-ом|1-я|1|первый|в) (сет|сэт|партия|период|четверть|четверти)|(сет|сэт|партия|период|четверть|четверти) 1/iu.test(betString): period = 'SET_01'; break;
      case /(2-й|2-м|2-ом|2-я|2|второй) (сет|сэт|партия|период|четверть|четверти)|(сет|сэт|партия|период|четверть|четверти) 2/iu.test(betString): period = 'SET_02'; break;
      case /(3-й|3-м|3-ом|3-я|3|третий) (сет|сэт|партия|период|четверть|четверти)|(сет|сэт|партия|период|четверть|четверти) 3/iu.test(betString): period = 'SET_03'; break;
      case /(4-й|4-м|4-ом|4-я|4|четвертый) (сет|сэт|партия|период|четверть|четверти)|(сет|сэт|партия|период|четверть|четверти) 4/iu.test(betString): period = 'SET_04'; break;
      case /(5-й|5-м|5-ом|5-я|5|пятый) (сет|сэт|партия|период|четверть|четверти)|(сет|сэт|партия|период|четверть|четверти) 5/iu.test(betString): period = 'SET_05'; break;
    }
    let team = '';
    switch (true) {
      case /или ничья/iu.test(betString) && (/: +1( +\(|$)/.test(betString) || /(1-й|1) ком/.test(betString) || /пер[^ ]* ком/iu.test(betString) || betString.indexOf(team1) !== -1): team = `1X`; break;
      case /или ничья/iu.test(betString) && (/: +2( +\(|$)/.test(betString) || /(2-й|2) ком/.test(betString) || /вто[^ ]* ком/iu.test(betString) || betString.indexOf(team2) !== -1): team = `2X`; break;
      case /: +1( +\(|$)/.test(betString): team = 'P1'; break;
      case /: +2( +\(|$)/.test(betString): team = 'P2'; break;
      case /(1-й|1) ком/.test(betString): team = 'P1'; break;
      case /(2-й|2) ком/.test(betString): team = 'P2'; break;
      case /пер[^ ]* ком/iu.test(betString): team = 'P1'; break;
      case /вто[^ ]* ком/iu.test(betString): team = 'P2'; break;
      case betString.indexOf(team1) !== -1: team = 'P1'; break;
      case betString.indexOf(team2) !== -1: team = 'P2'; break;
      case /ничья|наиб.*кол.*очк.*никто/iu.test(betString) && !/нулев.*ничья/iu.test(betString): team = 'PX'; break;
      case /(перв|посл).*гол.*никто/iu.test(betString): team = 'NO'; break;
    }
    let direction = '';
    switch (true) {
      case / больше|\(5\+\)|точн.*(бол|мен)|кол.*гол.*матче.* (бол|мен)/iu.test(betString): direction = 'OVER'; break;
      case / меньше/iu.test(betString): direction = 'UNDER'; break;
      case /равно|ровно|нулев/iu.test(betString): direction = 'EXACT'; break;
      case /бьет.*[0-9] или [0-9]/iu.test(betString): direction = 'EXACT'; break;
      case /точн/iu.test(betString) && !/точный счет/iu.test(betString) && !/бол|мен/iu.test(betString): direction = 'EXACT'; break;
      case /голов в матче|сколько|диапазон.*гол/iu.test(betString): direction = 'EXACT'; break;
    }
    let coff: number | string = '';
    switch (true) {
      case /количество/iu.test(betString) && /без гол/iu.test(betString): coff = '(0)'; break;
      case /нулев.*ничья/iu.test(betString): coff = '(0)'; break;
      case /\((\+?-?[0-9.]*)\)/.test(betString):
        coff = parseFloat(betString.replace(/.*\((\+?-?[0-9.]*)\).*/, '$1').replace('+', ''));
        if (/(трехисход|кол.*гол)/iu.test(betString)) {
          if (/больше/iu.test(betString)) {
            coff = `(${coff + 0.5})`;
          } else if (/меньше/iu.test(betString)) {
            coff = `(${coff - 0.5})`;
          } else {
            coff = `(${coff})`;
          }
        } else {
          coff = `(${coff})`;
        }
        break;
      case /кол.*гол.*: ?\([0-9-]*\)/iu.test(betString):
        coff = parseFloat(betString.replace(/.*\([0-9-]*\)/, '$1'));
        coff = /более/iu.test(betString) ? `(${coff - 0.5})` : /менее/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
        break;
      case /точное.*кол.*гол.*- +[0-9]{1,3}.*да/iu.test(betString):
        coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
        coff = /более/iu.test(betString) ? `(${coff - 0.5})` : /менее/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
        break;
      case /точное.*кол.*гол.*\([0-9]{1,3}.*\).*да/iu.test(betString):
        coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
        coff = /более/iu.test(betString) ? `(${coff - 0.5})` : /менее/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
        break;
      case /кол.*гол.*\([0-9]{1,3}.*(бол|мен).*\).*да/iu.test(betString):
        coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
        coff = /более/iu.test(betString) ? `(${coff - 0.5})` : /менее/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
        break;
      case /сколько/iu.test(betString) && /[0-9]$/iu.test(betString):
        coff = parseFloat(betString.replace(/.*([0-9])$/, '$1'));
        coff = /более/iu.test(betString) ? `(${coff - 0.5})` : /менее/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
        break;
      case /кол.*гол/iu.test(betString) && /[0-9]\+?$/iu.test(betString):
        coff = parseFloat(betString.replace(/.*([0-9])\+?$/, '$1'));
        coff = `(${coff - 0.5})`;
        break;
      case /фора.* +-?\+?[0-9.]{1,5}|тотал.* +-?\+?[0-9.]{1,5}$/iu.test(betString):
        coff = parseFloat(betString.replace(/.* +([0-9-+.]{1,5})$/, '$1'));
        coff = `(${coff})`;
        break;
    }
    let score = '';
    switch (true) {
      case /бьет.*[0-9] или [0-9]/.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}) или ([0-9]{1,3}).*/, '$1-$2')})`; break;
      case /([0-9]{1,3}:[0-9]{1,3})/.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}:[0-9]{1,3}).*/, '$1')})`; break;
      case /([0-9]{1,3}-[0-9]{1,3})/.test(betString): score = `(${betString.replace(/.*([0-9]{1,3})-([0-9]{1,3}).*/, '$1:$2')})`; break;
      case /диапазон.*[0-9]{1,3}-[0-9]{1,3}|кол.* голов в матче.*[0-9]{1,3}-[0-9]{1,3}/iu.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}-[0-9]{1,3}).*/, '$1')})`; break;
      case /гонка до [0-9]*/iu.test(betString): score = `(${betString.replace(/.*гонка до ([0-9]*).*/iu, '$1')})`; break;
    }
    let odd_event = '';
    switch (true) {
      case /неч(е|ё)т(н|\.).*нет$/iu.test(betString): odd_event = 'EVEN'; break;
      case /неч(е|ё)т(н|\.)$/iu.test(betString): odd_event = 'ODD'; break;
      case / ч(е|ё)т(н|\.).*нет$/iu.test(betString): odd_event = 'ODD'; break;
      case / ч(е|ё)т(н|\.)$/iu.test(betString): odd_event = 'EVEN'; break;
      case /неч(е|ё)тн.*нет/iu.test(betString): odd_event = 'EVEN'; break;
      case /неч(е|ё)тн/iu.test(betString): odd_event = 'ODD'; break;
      case / ч(е|ё)т(н|\.).*нет/iu.test(betString): odd_event = 'ODD'; break;
      case / ч(е|ё)т(н|\.)/iu.test(betString): odd_event = 'EVEN'; break;
      case /^ч(е|ё)т(н|\.).*нет/iu.test(betString): odd_event = 'ODD'; break;
      case /^ч(е|ё)т(н|\.)/iu.test(betString): odd_event = 'EVEN'; break;
    }
    let type = '';
    switch (true) {
      case /тайм забьет|забьет:|забьет.*да|забьет.*нет/iu.test(betString): type = `TEAM_TO_SCORE`; break;
      case /тотал углов/iu.test(betString): type = `TOTALS_CORNERS`; break;
      case /тотал.*в.*(сет|сэт|партия|период)/iu.test(betString): type = `SETS_TOTALS`; break;
      case /нечет|нечёт| четн| чётн| чет\.| чёт\./iu.test(betString): type = 'TOTALS'; break;
      case /забьет|тотал|кол.*гол|диапазон.*гол|итог/iu.test(betString): type = `TOTALS`; break;
      case /фора.*углов/iu.test(betString): type = `HANDICAP_CORNERS`; break;
      case /фора.*по.*(сет|сэт|партия|период)/iu.test(betString): type = `SETS_HANDICAP`; break;
      case /фора/iu.test(betString): type = `HANDICAP`; break;
      case /1 ?(х|x) ?2 углов/iu.test(betString): type = `WIN_CORNERS`; break;
      case /победа|ничья|проход|исход|выход|выйдет|наиб.*кол.*очк|результат|победитель/iu.test(betString) && !/результативная/iu.test(betString): type = `WIN`; break;
      case /обе.*забьют.*да/iu.test(betString): type = `BOTH_TEAMS_TO_SCORE__YES`; break;
      case /обе.*забьют.*нет/iu.test(betString): type = `BOTH_TEAMS_TO_SCORE__NO`; break;
      case /точный счет|счет: |период:.*счет/iu.test(betString): type = `CORRECT_SCORE`; break;
      case /углов/iu.test(betString): type = `WIN`; break;
      case /наберет.*очки.*первой/iu.test(betString): type = `WHO_SCORE__01`; break;
      case /первый гол/iu.test(betString): type = `WHO_SCORE_3W__01`; break;
      case /последний гол|наберет очки последней/iu.test(betString): type = `LAST_TEAM_TO_SCORE`; break;
      case /в.*сухую|победит и не пропустит|выиг.*все.*четв.*да/iu.test(betString): type = `CLEAN_SHEET`; break;
      case /НН|НП1|НП2|П1Н|П1П1|П1П2|П2Н|П2П1|П2П2/u.test(betString): type = `WIN_HALF_MATCH`; break;
      case /гол.*в.*тайме/iu.test(betString): type = `NO_ONE_TO_SCORE`; break;
      case /тай.*брейк.*матч/iu.test(betString): type = `WILL_BE_OT`; break;
      case /гонка до/iu.test(betString): type = `FIRST_TO_SCORE`; break;
    }
    let suffix = '';
    switch (true) {
      case /1x/iu.test(betString): suffix = `1X`; break;
      case /любой из/iu.test(betString): suffix = `12`; break;
      case /x2/iu.test(betString): suffix = `X2`; break;
    }
    let yes_no = '';
    switch (true) {
      case /в.*сухую.*да|победит и не пропустит.*да|тайм забьет.*да|гол.*в.*тайме.*нет|забьет:.*да|выиг.*все.*четв.*да|тай.*брейк.*матч.*да|забьет.*да/iu.test(betString) && !/точное/iu.test(betString): yes_no = `YES`; break;
      case /в.*сухую.*нет|победит и не пропустит.*нет|тайм забьет.*нет|гол.*в.*тайме.*да|забьет:.*нет|тай.*брейк.*матч.*нет|забьет.*нет/iu.test(betString) && !/точное/iu.test(betString): yes_no = `NO`; break;
    }
    let win_draw = '';
    switch (true) {
      case /НН/u.test(betString): win_draw = `PX_PX`; break;
      case /НП1/u.test(betString): win_draw = `PX_P1`; break;
      case /НП2/u.test(betString): win_draw = `PX_P2`; break;
      case /П1Н/u.test(betString): win_draw = `P1_PX`; break;
      case /П1П1/u.test(betString): win_draw = `P1_P1`; break;
      case /П1П2/u.test(betString): win_draw = `P1_P2`; break;
      case /П2Н/u.test(betString): win_draw = `P2_PX`; break;
      case /П2П1/u.test(betString): win_draw = `P2_P1`; break;
      case /П2П2/u.test(betString): win_draw = `P2_P2`; break;
    }
    if (sport === 'hockey' && !period) {
      let ot_rt = 'RT';
      if (/овер|OT|булл/u.test(betString) && !/ без /u.test(betString)) {
        ot_rt = 'OT';
      }
      switch (type) {
        case 'CORRECT_SCORE': type = `${type}_${ot_rt}`; break;
        case 'TOTALS': type = `${type}_${ot_rt}`; break;
        case 'HANDICAP': type = `${type}_${ot_rt}`; break;
        case 'WIN': type = `${type}_${ot_rt}`; break;
      }
    } else if (sport === 'basketball' && !period) {
      let ot_rt = 'OT';
      if (/к концу второй половины|к концу.*2.*половины|к концу четвертой четверти|к концу.*4.*четверти|без.*овертайма/u.test(betString) && !/ без /u.test(betString)) {
        ot_rt = 'RT';
      }
      switch (type) {
        case 'CORRECT_SCORE': type = `${type}_${ot_rt}`; break;
        case 'TOTALS': type = `${type}_${ot_rt}`; break;
        case 'HANDICAP': type = `${type}_${ot_rt}`; break;
        case 'WIN': type = `${type}_${ot_rt}`; break;
      }
    } else if (sport === 'football' && !period && /выход|выйдет/u.test(betString)) {
      type = `${type}_OT`;
    }

    if (/п1.*или|п2.*или|результат матча и тотал|карта|полный матч|тайме или матче|в один мяч.*или|с разницей в|сам.*результат|победа.*нет|каждая.*забьет|во всех|в компенсир|результат без победы|победит в|в 2 гол|в одном из|удаление|замена| мин|нечётный тотал|четный тотал|нечетный тотал|оба|сек|раньше|обоих|хотя бы|красн|подряд|ровно|ничья.*нет| и обе| и выиграет| и не выиграет| и проиграет| и ничья| и тб|выигра.*все.*четвер/iu.test(betString)) {
      return '';
    } else if (/инд\. тотал/ui.test(betString) && betString.indexOf(team1) === -1 && betString.indexOf(team2) === -1) {
      return '';
    } else if (type) {
      if (/НН|НП1|НП2|П1Н|П1П1|П1П2|П2Н|П2П1|П2П2/u.test(betString)) {
        if (!direction || (direction && (score || coff))) {
          return ([[team, type, direction, suffix, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), coff, score].join('') || '').trim();
        } else {
          return '';
        }
      } else {
        if (/бьет.*[0-9] или [0-9].*гол|тотал|кол.*гол.*/iu.test(betString)) {
          if (!direction || (direction && (score || coff))) {
            return ([[period, team, type, direction, suffix, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), coff, score].join('') || '').trim();
          } else {
            return '';
          }
        } else {
          if (!direction || (direction && (score || coff))) {
            return ([[period, type, team, direction, suffix, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), coff, score].join('') || '').trim();
          } else {
            return '';
          }
        }
      }
    }
  }
}
