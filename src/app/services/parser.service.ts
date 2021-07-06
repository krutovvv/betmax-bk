import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParserService {
  constructor() {
  }

  public parser(betString: string, team1: string, team2: string, sport: number): string {
    let period = '';
    switch (true) {
      case /(1-й|1-м|1-ом|1-я|1|первый) тай/iu.test(betString): period = 'HALF_01'; break;
      case /(2-й|2-м|2-ом|2-я|2|второй) тай/iu.test(betString): period = 'HALF_02'; break;
      case /(1-й|1-м|1-ом|1-я|1|первый|в) (сет|сэт|партия|период|четверть|четверти)/iu.test(betString): period = 'SET_01'; break;
      case /(2-й|2-м|2-ом|2-я|2|второй) (сет|сэт|партия|период|четверть|четверти)/iu.test(betString): period = 'SET_02'; break;
      case /(3-й|3-м|3-ом|3-я|3|третий) (сет|сэт|партия|период|четверть|четверти)/iu.test(betString): period = 'SET_03'; break;
      case /(4-й|4-м|4-ом|4-я|4|четвертый) (сет|сэт|партия|период|четверть|четверти)/iu.test(betString): period = 'SET_04'; break;
      case /(5-й|5-м|5-ом|5-я|5|пятый) (сет|сэт|партия|период|четверть|четверти)/iu.test(betString): period = 'SET_05'; break;
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
    }
    let score = '';
    switch (true) {
      case /бьет.*[0-9] или [0-9]/.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}) или ([0-9]{1,3}).*/, '$1-$2')})`; break;
      case /([0-9]{1,3}:[0-9]{1,3})/.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}:[0-9]{1,3}).*/, '$1')})`; break;
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
      case /тайм забьет|забьет:/iu.test(betString): type = `TEAM_TO_SCORE`; break;
      case /тотал углов/iu.test(betString): type = `TOTALS_CORNERS`; break;
      case /тотал.*(сет|сэт|партия|период)/iu.test(betString): type = `SETS_TOTALS`; break;
      case /нечет|нечёт| четн| чётн| чет\.| чёт\./iu.test(betString): type = 'TOTALS'; break;
      case /забьет|тотал|кол.*гол|диапазон.*гол|итог/iu.test(betString): type = `TOTALS`; break;
      case /фора.*углов/iu.test(betString): type = `HANDICAP_CORNERS`; break;
      case /фора.*(сет|сэт|партия|период)/iu.test(betString): type = `SETS_HANDICAP`; break;
      case /фора/iu.test(betString): type = `HANDICAP`; break;
      case /1 ?(х|x) ?2 углов/iu.test(betString): type = `WIN_CORNERS`; break;
      case /победа|ничья|проход|исход|выход|выйдет|наиб.*кол.*очк/iu.test(betString) && !/результативная/iu.test(betString): type = `WIN`; break;
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
      case /в.*сухую.*да|победит и не пропустит.*да|тайм забьет.*да|гол.*в.*тайме.*нет|забьет:.*да|выиг.*все.*четв.*да|тай.*брейк.*матч.*да/iu.test(betString) && !/точное/iu.test(betString): yes_no = `YES`; break;
      case /в.*сухую.*нет|победит и не пропустит.*нет|тайм забьет.*нет|гол.*в.*тайме.*да|забьет:.*нет|тай.*брейк.*матч.*нет/iu.test(betString) && !/точное/iu.test(betString): yes_no = `NO`; break;
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
    if (sport === 35 && !period) {
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
    } else if (sport === 23 && !period) {
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
    } else if (sport === 42 && !period && /выход|выйдет/u.test(betString)) {
      type = `${type}_OT`;
    }

    if (/п1.*или|п2.*или|тайме или матче|в один мяч.*или|с разницей в|сам.*результат|победа.*нет|каждая.*забьет|во всех|в компенсир|результат без победы|победит в|в 2 гол|в одном из|удаление|замена|мин|нечётный тотал|четный тотал|нечетный тотал|оба|сек|раньше|обоих|хотя бы|красн|подряд|ровно|ничья.*нет| и обе| и выиграет| и не выиграет| и проиграет| и ничья| и тб|выигра.*все.*четвер/iu.test(betString)) {
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
