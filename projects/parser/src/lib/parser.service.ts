import { Injectable } from '@angular/core';
import { TranslateService } from './translate.service';

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  constructor(private translateService: TranslateService) { }

  public parser(betString: string, team1: string, team2: string, sport: string, language = 'ru'): string {
    betString = this.translateService.translate(betString, language);

    if ([
      /п1.*или/iu, /п2.*или/iu, /результат матча и тотал/iu, /будет.*и не/iu, /результативность/iu, / и тм/iu,
      /тайме или матче/iu, /в один мяч.*или/iu, /с разницей в/iu, /сам.*результат/iu, /победа.*нет/iu, /каждая.*забьет/iu,
      /во всех/iu, /в компенсир/iu, /результат без победы/iu, /победит в/iu, /в одном из/iu,
      /удаление/iu, /замена/iu, / мин/iu, /нечётный тотал/iu, /четный тотал/iu, /оба/iu,
      /сек/iu, /раньше/iu, /обоих/iu, /минутные/iu, /хотя бы/iu, /красн/iu, /подряд/iu,
      / и обе/iu, /мин .*гола/iu, / и выиграет/iu, / и не выиграет/iu, / и проиграет/iu,
      / и ничья/iu, / и тб/iu, / \+ /iu, /победный перевес/iu, /с преимуществом .*в .*/iu, /супертотал/iu,
      /суперфора/iu, /тотал розыгрышей/iu, /счет по четвертям/iu, /выиграет остаток матча/iu,
      /победа по четвертям/iu, /точный счёт после/iu, /или лучше/iu, /следующие два гейма/iu,
      /будет лидировать/iu, /выиграет.*или/iu, /результат после/iu, /счёт любого игрока/iu,
      /преимущество после/iu, /гандикап на убийства/iu, /точный счёт раунда/iu,
      /победитель.* и.* тотал/iu, /победитель.* половины.* и.* карты/iu, /тотал убийств/iu,
      /половина.* (победитель|гандикап)/iu, /след.* гейм.* тотал очков.* 21/iu, /победа ровно в/iu,
      /1 гол или ничья/iu, /победа.* в (один|1).* гол/iu, /выиграет и тотал/iu, /не проиграет и тотал/iu,
      /обе команды забьют (больше|меньше)/iu, /время след.* гола/iu, /двойной шанс ?и/iu, /двойной шанс.* и.* тотал/iu,
      /тайм.*полное время/iu, /нет ставки.* ничья/iu, /двойной результат/iu, /1x2 и тотал/iu, /победа и тотал/iu,
      /победа точно.* [0-9]+ сет/iu, /победа.* в [0-9]+ гол/iu, /волевая победа/iu, /выйграет сет/iu,
      /фрагов в раунде/iu, /фора (на|по) раунд/iu, /выиграет.* все четверти/iu
    ].map(regexp => regexp.test(betString)).indexOf(true) !== -1) {
      return '';
    }

    let type = '';
    switch (true) {
      case /гонка до.*углов[^ ]*/iu.test(betString): type = `FIRST_TO_SCORE_3W_CORNERS`; break;
      case /угловой через один|[0-9]+ углов[^ ]*:/iu.test(betString): type = `WHO_SCORE_3W_CORNERS`; break;
      case /последний угловой/iu.test(betString): type = `LAST_TO_SCORE_CORNERS`; break;
      case /тотал углов|углов.*2 исх.*|азиатские угловые/iu.test(betString): type = `TOTALS_CORNERS`; break;
      case /фора.*углов/iu.test(betString): type = `HANDICAP_CORNERS`; break;
      case /гонка до.* очков/iu.test(betString): type = `FIRST_TO_SCORE_3W`; break;
      case /гонка до|первым наберёт/iu.test(betString): type = `FIRST_TO_SCORE`; break;
      case /следующая игра|побед.* в гейме/iu.test(betString): type = `GAME`; break;
      case /забьет последний гол/iu.test(betString): type = `LAST_TO_SCORE`; break;
      case /последний гол|наберет очки последней|пос.*ком.*зараб.*очк/iu.test(betString): type = `LAST_TEAM_TO_SCORE`; break;
      case /забьет в.* половине|тайм забьет|забьет:|забьет[^0-9]* да|забьет[^0-9]* нет|забьет.*тайм.* да|забьет.*тайм.* нет/iu.test(betString): type = `TEAM_TO_SCORE`; break;
      case /сет гандикап|фора по.*(сета|сэта|партия|периода|четверт|карт)|(фора|гандикап) на матч.*сет/iu.test(betString): type = `SETS_HANDICAP`; break;
      case /гандикап.* [0-9]{1,3}:[0-9]{1,3}|гандикап.*3 исход|3 исход.*гандикап/iu.test(betString): type = `HANDICAP_3W`; break;
      case /ничья.* ставка недейст|ничья.* нет ставки|handicap|фора|гандикап|результат без ничьи/iu.test(betString): type = `HANDICAP`; break;
      case /тотал (геймов|партий)|тотал по (геймам|партиям)/iu.test(betString) && (sport === 'volleyball' || sport === 'table-tennis'): type = `SETS_TOTALS`; break;
      case /точное сет|тотал карт|тотал по (сет|сэт|карт)/iu.test(betString): type = `SETS_TOTALS`; break;
      case /победа в раунде/iu.test(betString): type = `WHO_SCORE`; break;
      case /первый гол|забьёт следующий \(1\) гол|следующий гол|[0-9]+-й гол/iu.test(betString): type = `WHO_SCORE_3W`; break;
      case /итоговый результат|кол.* (игр|геймов).* текущем|тотал|гол.* команд|точное кол.* голов|нечет|нечёт| четн| чётн| чет\.| чёт\.|кол.*геймов.*в.*сете/iu.test(betString): type = 'TOTALS'; break;
      case /раунд.* победитель|след.* (гейм|игра).* (первое|1).* очко|наберет.*очки.*первой|победитель [0-9]{1,3} раунда|поинты .* в .*гейме|ставк.*на.*очк/iu.test(betString): type = `WHO_SCORE`; break;
      case /счёт по сетам|правильный счёт|текущий сет|точный сч(е|ё)т|счет: |период:.*сч(е|ё)т/iu.test(betString): type = `CORRECT_SCORE`; break;
      case /альтернативн.* гол|линия.* гол|голы в матче|забьет|тотал|кол.*гол|диапазон.*гол|итог |точное кол.* очков/iu.test(betString): type = `TOTALS`; break;
      case /1 ?(х|x) ?2 углов|углов.* 1x2/iu.test(betString): type = `WIN_CORNERS`; break;
      case /в.*сухую|победит и не пропустит|выиг.*все.*четв.* да/iu.test(betString): type = `CLEAN_SHEET`; break;
      case /итоговый победитель|побед|ничья|проход|исход|выход|выйдет|наиб.*кол.*очк|результат|победитель|не проиграет|winner|двойной шанс|углов|1x2/iu.test(betString) && !/результативная|ничья.* нет/iu.test(betString): type = `WIN`; break;
      case /обе.*забьют.*да|обе.*забьют.*нет/iu.test(betString): type = `BOTH_TEAMS_TO_SCORE`; break;
      case /НН|НП1|НП2|П1Н|П1П1|П1П2|П2Н|П2П1|П2П2/u.test(betString): type = `WIN_HALF_MATCH`; break;
      case /гол.*в.*тайме|^гол [1-2]-й тайм|^гол в матче/iu.test(betString): type = `NO_ONE_TO_SCORE`; break;
      case /game.* extra points|тай.*брейк.*(да|нет)|тай.*брейк.*матч|будет.*овертайм|будет.*тай.*брейк|в доп[^ ]* очки|доп[^ ]* очки тек.* (да|нет)|дополнительные (подачи|раунды)/iu.test(betString): type = `WILL_BE_OT`; break;
    }
    if (!type) {
      return '';
    }

    let period = '';
    if (['WILL_BE_OT', 'WIN', 'HANDICAP', 'TOTALS', 'SCORE'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /(^| )(1-й|1-м|1-ом|1-я|1|перв[^ ]*) (тай|половин)|тайм 1/iu.test(betString): period = 'HALF_01'; break;
        case /(^| )(2-й|2-м|2-ом|2-я|2|втор[^ ]*) (тай|половин)|тайм 2/iu.test(betString): period = 'HALF_02'; break;
        case /(^| )(1rd|1-й|1-м|1-ом|1-я|1|перв[^ ]*)[^0-9]* (сет|сэт|парт|период|четвер|карта|гейм|map|game|quarter)[^ ]*|(сет|сете|сэт|партия|период|четверть|карта|гейм|map|game|quarter) 1|в игре 1$|игра 1| в четверти:/iu.test(betString): period = 'SET_01'; break;
        case /(^| )(2rd|2-й|2-м|2-ом|2-я|2|втор[^ ]*)[^0-9]* (сет|сэт|парт|период|четвер|карта|гейм|map|game|quarter)[^ ]*|(сет|сете|сэт|партия|период|четверть|карта|гейм|map|game|quarter) 2|в игре 2$|игра 2|счёт сета/iu.test(betString): period = 'SET_02'; break;
        case /(^| )(3rd|3-й|3-м|3-ом|3-я|3|трет[^ ]*)[^0-9]* (сет|сэт|парт|период|четвер|карта|гейм|map|game|quarter)[^ ]*|(сет|сете|сэт|партия|период|четверть|карта|гейм|map|game|quarter) 3|в игре 3$|игра 3/iu.test(betString): period = 'SET_03'; break;
        case /(^| )(4rd|4-й|4-м|4-ом|4-я|4|четв[^ ]*)[^0-9]* (сет|сэт|парт|период|четвер|карта|гейм|map|game|quarter)[^ ]*|(сет|сете|сэт|партия|период|четверть|карта|гейм|map|game|quarter) 4|в игре 4$|игра 4/iu.test(betString): period = 'SET_04'; break;
        case /(^| )(5rd|5-й|5-м|5-ом|5-я|5|пят[^ ]*)[^0-9]* (сет|сэт|парт|период|четвер|карта|гейм|map|game|quarter)[^ ]*|(сет|сете|сэт|партия|период|четверть|карта|гейм|map|game|quarter) 5|в игре 5$|игра 5/iu.test(betString): period = 'SET_05'; break;
      }
    }

    let direction = '';
    if (['TOTALS'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /кол.* (голов|очков)|диапазон.* гол|голов в матче|сколько голов|равно|ровно|нулев|бьет.*[0-9] или [0-9]|тотал геймов:|точно/iu.test(betString) && (!/точный сч(е|ё)т|диапазон.* гол.*\+$|количество голов.*\+$|сколько голов.*\+$| мен| бол|\+ (голов|голы)$|[0-9]+\+$/iu.test(betString) || /без гола/iu.test(betString)): direction = 'EXACT'; break;
        case / б(о|o)льш(е|e)|\(5\+\)|точн.*бол|кол.*гол.*матче.* (бол|мен)|точное кол.* [0-9]+\+ гол.*|выше|диапазон.* гол.*\+| Б | Б$|сколько голов.*\+/iu.test(betString): direction = 'OVER'; break;
        case / м(е|e)ньш(е|e)|точн.*мен|ниже| М | М$/iu.test(betString): direction = 'UNDER'; break;
      }
    }

    let coff: number | string = '';
    if (['TOTALS', 'HANDICAP'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /\([0-9]+-[0-9]+\)|азиатский гандикап/iu.test(betString) && /\(\+?-?[0-9]+\.?[0-9]*(,\+?-?[0-9]*\.?[0-9]*\)|\))/iu.test(betString):
          const c1 = parseFloat(betString.replace(/.*\(\+?(-?[0-9]+\.?[0-9]*)(,\+?-?[0-9]*\.?[0-9]*\)|\)).*/iu, '$1'));
          const c2 = parseFloat(betString.replace(/.*\(\+?-?[0-9]+\.?[0-9]*(,\+?(-?[0-9]*\.?[0-9]*)\)|\)).*/iu, '$2'));
          const c3 = /.*\(([0-9]+)-[0-9]+\).*/iu.test(betString) ? parseInt(betString.replace(/.*\(([0-9]+)-[0-9]+\).*/iu, '$1'), 10) : NaN;
          const c4 = /.*\([0-9]+-([0-9]+)\).*/iu.test(betString) ? parseInt(betString.replace(/.*\([0-9]+-([0-9]+)\).*/iu, '$1'), 10) : NaN;
          if (type.indexOf('HANDICAP') !== -1) {
            coff = (c1 || c1 === 0) && c3 && c4 ? `(${(c1 + ((c2 || c2 === 0) ? ((c2 - c1) / 2) : 0)) - c3 + c4})` : (c1 || c1 === 0) && (c2 || c2 === 0) ? `(${c1 + ((c2 - c1) / 2)})` : (c1 || c1 === 0) ? `(${c1})` : '';
          } else {
            coff = (c1 || c1 === 0) && c3 && c4 ? `(${(c1 + ((c2 || c2 === 0) ? ((c2 - c1) / 2) : 0)) + c3 + c4})` : (c1 || c1 === 0) && (c2 || c2 === 0) ? `(${c1 + ((c2 - c1) / 2)})` : (c1 || c1 === 0) ? `(${c1})` : '';
          }
          break;
        case /количество/iu.test(betString) && /без гол/iu.test(betString):
          coff = '(0)';
          break;
        case /нулев.*ничья/iu.test(betString):
          coff = '(0)';
          break;
        case /\((\+?-?[0-9.]*)\)/iu.test(betString):
          coff = parseFloat(betString.replace(/.*\((\+?-?[0-9.]*)\).*/, '$1').replace('+', ''));
          if (/(трехисход|трехпутев|кол.*гол)/iu.test(betString)) {
            coff = /больше/iu.test(betString) ? `(${coff + 0.5})` : /меньше/iu.test(betString) ? `(${coff - 0.5})` : `(${coff})`;
          } else if (/забьёт следующий \([0-9]\) гол/iu.test(betString)) {
            coff = '';
          } else {
            coff = `(${coff})`;
          }
          break;
        case /кол.*гол.*: ?\([0-9-]*\)/iu.test(betString):
          coff = parseFloat(betString.replace(/.*\([0-9-]*\)/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /точное.*кол.*гол.*- +[0-9]{1,3}.*да/iu.test(betString):
          coff = parseFloat(betString.replace(/.*([0-9]{1,3})/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /точное.*кол.*гол.*\([0-9]{1,3}.*\).*да/iu.test(betString):
          coff = parseFloat(betString.replace(/.*([0-9]{1,3})/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /точное кол.* ([0-9]+)\+? гол.*/iu.test(betString):
          coff = parseFloat(betString.replace(/.*точное кол.* ([0-9]+)\+? гол.*/iu, '$1'));
          coff = /[0-9]+\+ гол.*/iu.test(betString) ? `(${coff - 0.5})` : `(${coff})`;
          break;
        case /кол.*гол.*\([0-9]{1,3}.*(бол|мен).*\).*да/iu.test(betString):
          coff = parseFloat(betString.replace(/.*([0-9]{1,3})/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /сколько/iu.test(betString) && /[0-9]$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*([0-9])$/, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /кол.*гол/iu.test(betString) && /[0-9]\+?$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*([0-9])\+?$/iu, '$1'));
          coff = /\+$/iu.test(betString) ? `(${coff - 0.5})` : `(${coff})`;
          break;
        case /точное кол[^ ]* .* [0-9]+ и (бол|мен)/iu.test(betString):
          coff = parseFloat(betString.replace(/.*точное кол[^ ]* .* ([0-9]+) и (бол|мен).*/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
          break;
        case /трехпутевой тотал.* [0-9]*$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*трехпутевой тотал.* ([0-9]*)$/iu, '$1'));
          coff = /бол/iu.test(betString) ? `(${coff + 0.5})` : /мен/iu.test(betString) ? `(${coff - 0.5})` : `(${coff})`;
          break;
        case /фора.* +-?\+?[0-9.]{1,7}|тотал.* +-?\+?[0-9.]{1,7}$/iu.test(betString):
          coff = parseFloat(betString.replace(/.* +([0-9-+.]{1,7})$/iu, '$1'));
          coff = `(${coff})`;
          break;
        case /тотал.* +(-?\+?[0-9.]{1,7})/iu.test(betString):
          coff = parseFloat(betString.replace(/.*тотал.* +(-?\+?[0-9.]{1,7}).*/iu, '$1'));
          coff = `(${coff})`;
          break;
        case /альтернативн.* гол.* (больше|меньше) [0-9.]{1,7}/iu.test(betString):
          coff = parseFloat(betString.replace(/.*альтернативн.* гол.* (больше|меньше) ([0-9.]{1,7}).*/iu, '$2'));
          coff = `(${coff})`;
          break;
        case /(^| )[0-9]+(,|\.)?[0-9]* игр/iu.test(betString):
          coff = parseFloat(betString.replace(/.*(^| )([0-9]+(,|\.)?[0-9]*) игр.*/iu, '$2').replace(/,/g, '.'));
          coff = `(${coff})`;
          break;
        case /гандикап на раунды.* +-?\+?[0-9.]{1,7}$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*гандикап на раунды.* +([0-9-+.]{1,7}).*/iu, '$1'));
          coff = `(${coff})`;
          break;
        case /диапазон гол.* [0-9]{1,7}\+?$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*диапазон гол.* ([0-9]{1,7})\+?$/iu, '$1'));
          coff = `(${coff})`;
          break;
        case /точное сет: [0-9]+$/iu.test(betString):
          coff = parseFloat(betString.replace(/.*точное сет: ([0-9]+)$/iu, '$1'));
          coff = `(${coff})`;
          break;
        case /ничья.* нет ставки|ничья.* ставка недейст|результат без ничьи/iu.test(betString):
          coff = `(0)`;
          break;
      }
    }

    let team = '';
    if (['WIN', 'HANDICAP', 'TOTALS', 'WHO_SCORE', 'TO_SCORE', 'GAME', 'CLEAN_SHEET'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /или ничья/iu.test(betString) && (/: +1( +\(|$)/.test(betString) || /(1-й|1) ком/.test(betString) || /пер[^ ]* ком/iu.test(betString) || betString.indexOf(team1) !== -1): team = `1X`; break;
        case /или ничья/iu.test(betString) && (/: +2( +\(|$)/.test(betString) || /(2-й|2) ком/.test(betString) || /вто[^ ]* ком/iu.test(betString) || betString.indexOf(team2) !== -1): team = `X2`; break;
        case / 1(x|х) | 1(x|х)$/iu.test(betString): team = `1X`; break;
        case /двойной шанс.*не проиграет/iu.test(betString) && betString.indexOf(team1) !== -1: team = `1X`; break;
        case /или/iu.test(betString) && betString.indexOf(team1) !== -1 && betString.indexOf(team2) !== -1: team = `12`; break;
        case /любой из|не будет ничьи|двойной шанс.* 12| 12$/iu.test(betString) && !/больше 12|меньше 12/iu.test(betString): team = `12`; break;
        case / 2(x|х) | 2(x|х)$| (x|х)2 | (x|х)2$/iu.test(betString): team = `X2`; break;
        case /двойной шанс.*не проиграет|ничья.*или/iu.test(betString) && betString.indexOf(team2) !== -1: team = `X2`; break;
        case /ничья|наиб.*кол.*очк.*никто/iu.test(betString) && !/нет ставки|ставка недейст|нулев.*ничья|точный счёт/iu.test(betString): team = 'PX'; break;
        case / X$| Х$/iu.test(betString): team = 'PX'; break;
        case /(перв|посл).*гол.*никто|забь?(е|ё)т.*следующ.*\(?1\)?.*гол.*никто|гол.*не будет|забь?(е|ё)т.*не будет|гонка до.* ни один|углов.* не будет/iu.test(betString): team = 'NO'; break;
        case /без гола/iu.test(betString) && !coff: team = 'NO'; break;
        case (betString.indexOf(team1) !== -1 || betString.indexOf(this.translateService.transliterate(team1)) !== -1) && !/точный счёт/iu.test(betString): team = 'P1'; break;
        case (betString.indexOf(team2) !== -1 || betString.indexOf(this.translateService.transliterate(team2)) !== -1) && !/точный счёт/iu.test(betString): team = 'P2'; break;
        case /(1-й|1) ком|пер[^ ]* ком|команда 1|хозяев.*|(фора|индивидуальный тотал|трехпутевой тотал) 1|фора (по|на) (парти|сет|четвер|раунд)[^ ]* 1| П1|фора[^:]*: +1( +\(|$)/iu.test(betString): team = 'P1'; break;
        case /(2-й|2) ком|вто[^ ]* ком|команда 2|гост.*|(фора|индивидуальный тотал|трехпутевой тотал) 2|фора (по|на) (парти|сет|четвер|раунд)[^ ]* 2| П2|фора[^:]*: +2( +\(|$)/iu.test(betString): team = 'P2'; break;
      }
    }

    let odd_event = '';
    if (['TOTALS'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /неч(е|ё)т(н|\.)?$| ч(е|ё)т(н|\.).* нет$|неч(е|ё)тн| ч(е|ё)т(н|\.).* нет|^ч(е|ё)т(н|\.).* нет| ч(е|ё)т .* ?нет/iu.test(betString): odd_event = 'ODD'; break;
        case /неч(е|ё)т(н|\.).* нет$|неч(е|ё)тн.* нет| ч(е|ё)т(н|\.)?$| ч(е|ё)т(н|\.).* да| ч(е|ё)т(н|\.)|^ч(е|ё)т(н|\.)| ч(е|ё)т .* ?да/iu.test(betString): odd_event = 'EVEN'; break;
      }
    }

    let score = '';
    if (['SCORE', 'HANDICAP_3W', 'TOTALS'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /гандикап.* [0-9]{1,3}:[0-9]{1,3}/iu.test(betString): const s1 = parseInt(betString.replace(/.*гандикап.* ([0-9]{1,3}):[0-9]{1,3}.*/iu, '$1'), 10); const s2 = parseInt(betString.replace(/.*гандикап.* [0-9]{1,3}:([0-9]{1,3}).*/iu, '$1'), 10); score = `(${team === 'P1' ? s2 - s1 : s1 - s2})`; break;
        case /бьет.* [0-9] или [0-9]/iu.test(betString): score = `(${betString.replace(/.* ([0-9]{1,3}) или ([0-9]{1,3}).*/iu, '$1-$2')})`; break;
        case /кол.*голов.*\([0-9]+-[0-9]+\)/iu.test(betString): score = `(${betString.replace(/.*кол.*голов.*\(([0-9]+)-([0-9]+)\).*/iu, '$1-$2')})`; break;
        case /точное количество.* [0-9]+ ?- ?[0-9]+/iu.test(betString): score = `(${betString.replace(/.*точное количество.* ([0-9]+) ?- ?([0-9]+).*/iu, '$1-$2')})`; break;
        case /диапазон.*[0-9]{1,3}-[0-9]{1,3}|кол.* голов в матче.*[0-9]{1,3}-[0-9]{1,3}/iu.test(betString): score = `(${betString.replace(/.*([0-9]{1,3}-[0-9]{1,3}).*/iu, '$1')})`; break;
        case / ([0-9]{1,3}:[0-9]{1,3})/iu.test(betString): score = `(${betString.replace(/.* ([0-9]{1,3}:[0-9]{1,3}).*/iu, '$1')})`; break;
        case / ([0-9]{1,3}-[0-9]{1,3})/iu.test(betString) && !/\(\+?-?[0-9]+\.?[0-9]*(,\+?-?[0-9]*\.?[0-9]*\)|\))/iu.test(betString): score = betString.indexOf(team2) !== -1 ? `(${betString.replace(/.* ([0-9]{1,3})-([0-9]{1,3}).*/iu, '$2:$1')})` : `(${betString.replace(/.* ([0-9]{1,3})-([0-9]{1,3}).*/iu, '$1:$2')})`; break;
        case /.*фора [1-2] [0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/.*фора [1-2] ([0-9.-]+).*/iu, '$1')})`; break;
        case /.*фора по (партиям|сетам|четвертям) [1-2] [0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/.*фора по (партиям|сетам|четвертям) [1-2] ([0-9.-]+).*/iu, '$2')})`; break;
        case /.*индивидуальный тотал [1-2]-[а-я]{2} [1-2]-[а-я] сет [0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/.*индивидуальный тотал [1-2]-[а-я]{2} [1-2]-[а-я] сет ([0-9.-]+).*/iu, '$1')})`; break;
        case /.*индивидуальный тотал [1-2](-го | )[0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/.*индивидуальный тотал [1-2](-го | )([0-9.-]+).*/iu, '$2')})`; break;
        case /^тотал [1-2]-[а-я] сет [0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/^тотал [1-2]-[а-я] сет ([0-9.-]+).*/iu, '$1')})`; break;
        case /^тотал [-]?[0-9.]+.*/iu.test(betString): score = `(${betString.replace(/^тотал ([-]?[0-9.]+).*/iu, '$1')})`; break;
        case /^азиатский тотал [-]?[0-9.]+.*/iu.test(betString): score = `(${betString.replace(/^азиатский тотал ([-]?[0-9.]+).*/iu, '$1')})`; break;
        case /^фора [1-2]-[а-я] сет [0-9] [0-9.-]+.*/iu.test(betString): score = `(${betString.replace(/^фора [1-2]-[а-я] сет [0-9] ([0-9.-]+).*/iu, '$1')})`; break;
        case /любой другой/iu.test(betString): score = `(ANY_OTHER)`; break;
      }
    }

    let yes_no = '';
    if (['SCORE', 'CLEAN_SHEET', 'WILL_BE_OT', 'TOTALS', 'WIN'].filter(t => type.indexOf(t) !== -1).length > 0 && !direction) {
      switch (true) {
        case /в.*сухую.* да|победит и не пропустит.* да|тайм забьет.* да|гол.*в.*тайме.* нет|забьет:.* да|выиг.*все.*четв.* да|тай.*брейк.*матч.* да|забьет[^0-9]* да|забьет.*тайм.* да|^гол [1-2]-й тайм.* нет|^гол в матче.* нет|будет.*тай.*брейк.* да|обе.*забьют.* да|забьет в.* половине.*забьет|в дополнительные очки.* да|game.* extra points.* yes|доп[^ ]* очки тек.* да|будет.*овертайм.* да|дополнительные (подачи|раунды).* да|тай.*брейк.* да/iu.test(betString) && !/точное|забьет в.* половине.*не забьет/iu.test(betString): yes_no = `YES`; break;
        case /в.*сухую.* нет|победит и не пропустит.* нет|тайм забьет.* нет|гол.*в.*тайме.* да|забьет:.* нет|тай.*брейк.*матч.* нет|забьет[^0-9]* нет|забьет.*тайм.* нет|^гол [1-2]-й тайм.* да|^гол в матче.* да|будет.*тай.*брейк.* нет|обе.*забьют.* нет|следующий гол.*не забьет|забьет в.* половине.*не забьет|в дополнительные очки.* нет|game.* extra points.* no|доп[^ ]* очки тек.* нет|будет.*овертайм.* нет|дополнительные (подачи|раунды).* нет|тай.*брейк.* нет/iu.test(betString) && !/точное/iu.test(betString): yes_no = `NO`; break;
        case /в.*сухую.*/iu.test(betString) && !/ да | нет | да$| нет$/iu.test(betString): yes_no = `YES`; break;
      }
    }

    let win_draw = '';
    if (['WIN_HALF_MATCH'].filter(t => type.indexOf(t) !== -1).length > 0) {
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
    }

    let points = '';
    if (['SCORE', 'GAME'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /победа в раунде.* ([0-9]+) раунде/iu.test(betString): points = ('0' + betString.replace(/.*победа в раунде.* ([0-9]+) раунде.*/iu, '$1')).substr(-2); break;
        case /победа в гейме.* гейм ([0-9]+)/iu.test(betString): points = ('0' + betString.replace(/.*победа в гейме.* гейм ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /раунд.* ([0-9]+).* победитель/iu.test(betString): points = ('0' + betString.replace(/.*раунд.* ([0-9]+).* победитель.*/iu, '$1')).substr(-2); break;
        case /очк[^ ]* ([0-9]+)/iu.test(betString): points = ('0' + betString.replace(/.*очк[^ ]* ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /point ([0-9]+).*/iu.test(betString): points = ('0' + betString.replace(/.*point ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /гонка.* ([0-9]+) углов/iu.test(betString): points = ('0' + betString.replace(/.*гонка.* ([0-9]+) углов.*/iu, '$1')).substr(-2); break;
        case /гонка до ([0-9]+)/iu.test(betString): points = ('0' + betString.replace(/.*гонка до ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /угловой через один.* ([0-9]+)/iu.test(betString): points = ('0' + betString.replace(/.*угловой через один.* ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /([0-9]+) углов[^ ]*:/iu.test(betString): points = ('0' + betString.replace(/.*([0-9]+) углов[^ ]*:.*/iu, '$1')).substr(-2); break;
        case / [0-9]+-?[^ ]? поинт/iu.test(betString): points = ('0' + betString.replace(/.* ([0-9]+)-?[^ ]? поинт.*/iu, '$1')).substr(-2); break;
        case /[0-9]+ очков/iu.test(betString): points = ('0' + betString.replace(/.*?([0-9]+) очков.*/iu, '$1')).substr(-2); break;
        case /[0-9]+-й гол/iu.test(betString): points = ('0' + betString.replace(/.*?([0-9]+)-й гол.*/iu, '$1')).substr(-2); break;
        case /следующий гол.* ([0-9]+)-[^ ]* гол/iu.test(betString): points = ('0' + betString.replace(/.*следующий гол.* ([0-9]+)-[^ ]* гол.*/iu, '$1')).substr(-2); break;
        case /победитель [0-9]+ раунда/iu.test(betString): points = ('0' + betString.replace(/.*победитель ([0-9]+) раунда.*/iu, '$1')).substr(-2); break;
        case /первое очко|первый гол|забьёт следующий \(1\)|наберет.*очки.*первой/iu.test(betString): points = '01'; break;
        case /побед.* 21/iu.test(betString): points = '21'; break;
      }
    }

    let games = '';
    if (['SCORE', 'GAME'].filter(t => type.indexOf(t) !== -1).length > 0) {
      switch (true) {
        case /победа в гейме ([0-9]+).* сет/iu.test(betString): games = ('0' + betString.replace(/.*победа в гейме ([0-9]+).* сет.*/iu, '$1')).substr(-2); break;
        case /21.* (игр|гейм)/iu.test(betString): games = '00'; break;
        case /.* гейм ([0-9]+).*/iu.test(betString) && !/победа в гейме|победитель (текущ.*|следующ.*) (гейм|игр)/iu.test(betString): games = ('0' + betString.replace(/.* гейм ([0-9]+).*/iu, '$1')).substr(-2); break;
        case /.* [0-9]+-?[^ ]? гейм.*/iu.test(betString) && !/гонка до ([0-9]+)|победитель текущего гейма/iu.test(betString): games = ('0' + betString.replace(/.* ([0-9]+)-?[^ ]? гейм.*/iu, '$1')).substr(-2); break;
      }
    }

    if (
      (['CORRECT_SCORE', 'HANDICAP'].indexOf(type) !== -1 && !score && !coff && !team) ||
      (['WIN'].indexOf(type) !== -1 && !team) ||
      (/инд\. тотал/ui.test(betString) && betString.indexOf(team1) === -1 && betString.indexOf(team2) === -1) ||
      (direction && !score && !coff) ||
      (['WHO_SCORE', 'GAME'].indexOf(type) !== -1 && !team) ||
      (['WILL_BE_OT'].indexOf(type) !== -1 && !yes_no) ||
      (['TOTALS'].indexOf(type) !== -1 && !direction && !odd_event) ||
      (['TOTALS', 'HANDICAP', 'HANDICAP_3W'].indexOf(type) !== -1 && !score && !coff && !odd_event && !team)
    ) {
      return '';
    }

    if (sport === 'hockey') {
      if (!period) {
        let ot_rt = 'RT';
        if (/овер|OT|булл|полный матч|не проиграет|победа в матче/iu.test(betString) && !/ без |двойной шанс/iu.test(betString)) {
          ot_rt = 'OT';
        }
        switch (type) {
          case 'CORRECT_SCORE': type = `${type}_${ot_rt}`; break;
          case 'TOTALS': type = `${type}_${ot_rt}`; break;
          case 'HANDICAP': type = `${type}_${ot_rt}`; break;
          case 'WIN': type = `${type}_${ot_rt}`; break;
        }
      }
    } else if (sport === 'basketball') {
      if (!period) {
        let ot_rt = 'OT';
        if (/к концу второй половины|к концу.*2.*половины|к концу четвертой четверти|к концу.*4.*четверти|без.*овертайма|на основное время|результат матча|ничья|1x2/iu.test(betString) && !/ без /iu.test(betString)) {
          ot_rt = 'RT';
        }
        switch (type) {
          case 'CORRECT_SCORE': type = `${type}_${ot_rt}`; break;
          case 'TOTALS': type = `${type}_${ot_rt}`; break;
          case 'HANDICAP': type = `${type}_${ot_rt}`; break;
          case 'WIN': type = `${type}_${ot_rt}`; break;
        }
      }
    } else if (sport === 'football') {
      if (!period) {
        if (/выход|выйдет|полный матч|проход.*полный матч|проход.* основной/iu.test(betString)) {
          switch (type) {
            case 'CORRECT_SCORE': type = `${type}_OT`; break;
            case 'TOTALS': type = `${type}_OT`; break;
            case 'HANDICAP': type = `${type}_OT`; break;
            case 'WIN': type = `${type}_OT`; break;
          }
        }
      }
    }

    if (['GAME', 'FIRST_TO_SCORE_3W_CORNERS'].indexOf(type) !== -1) {
      return ([[type, [period.replace(/[^0-9]*/g, ''), games, points].filter(i => !!i).join('_'), team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
    } else if (win_draw) {
      if (score || coff) {
        return ([[type, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
      } else {
        return ([[type, [games, points].filter(i => !!i).join('_'), direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
      }
    } else {
      if (direction === 'EXACT' || ['TOTALS', 'TOTALS_OT', 'TOTALS_RT', 'TOTALS_CORNERS'].indexOf(type) !== -1) {
        if (score || coff) {
          return ([[period, team, type, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        } else {
          return ([[period, team, type, [games, points].filter(i => !!i).join('_'), direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        }
      } else {
        if (score || coff) {
          return ([[period, type, team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        } else {
          return ([[period, type, [games, points].filter(i => !!i).join('_'), team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        }
      }
    }
  }
}
