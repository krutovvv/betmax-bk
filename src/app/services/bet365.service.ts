import { Injectable } from '@angular/core';
import football from '../data/bet365/football.json';
import hockey from '../data/bet365/hockey.json';
import tableTennis from '../data/bet365/table-tennis.json';
import tennis from '../data/bet365/tennis.json';
import volleyball from '../data/bet365/volleyball.json';
import basketball from '../data/bet365/basketball.json';
import cs from '../data/bet365/cs.json';
import { CheckService } from '../../../projects/parser/src/lib/check.service';
import { ParserService } from '../../../projects/parser/src/lib/parser.service';

interface TennisData {
  gamesPlayedInPreviousSets: number;
  currentSet: number;
}

@Injectable({
  providedIn: 'root'
})
export class Bet365Service {

  private settingsTitles = ['Настройки'];

  private translationsRegExps: { [translation: string]: RegExp[] } = {
    '': [/выиграет сет$|выиграет все сеты|выиграет, отставая| - женщины/],
    'asian total corners': [/азиатский гандикап - тотал угловых/],
    'fulltime result': [/результат (к концу полного времени|основного времени)/],
    'half time result': [/результат первой половины|половина игры/],
    'to qualify': [/пройти отбор/],
    'first half': [/на половину игры/],
    'clean sheet': [/не пропустит ни одного гола/],
    'to win to nil': [/выиграет всухую/],
    '2nd half result': [/результат 2-й половины/],
    '$1st half corners': [/угловые (\d)-й половины/],
    'will there be overtime?': [/будет ли овертайм\?|дополнительное время/],
    'result/total goals': [/результат\/тотал голов/],
    'corners over': [/больш[еe] угловых/],
    'corners under': [/м[еe]ньш[еe] угловых/],
    'corners exactly': [/точное количество угловых/],
    'result/both teams to score': [/тотал голов\/обе команды забьют/],
    'point betting': [/ставки на очки/],
    'in set $1': [/в игре (\d+)/],
    'current set extra points': [/дополнительные очки текущего сета/],
    'team to draw first blood': [/команда прольёт первую кровь/],
    'match handicap': [/^гандикап на матч$/],
    'race to $1 kills': [/первые (\d+) убийств/],
    'correct map score - best of $1': [/точный счёт - карта \((\d+)\)/],
    'to score point $1': [/заработает очко (\d+)/],
    'draw no bet': [/ничья \- нет ставки/],
    '$1st half - handicap': [/гандикап на (\d)-ю половину/],
    'home team odd/even goals': [/(голы )?команд[ыа] (хозяев|гостей)( - голы -)? неч[её]т\/ч[её]т(.*)$/],
    'corners 2-way': [/2 исхода на угловые|угловые - 2 исхода/],
    'most': [/больш[еe] вс[еe]го/],
    'current game': [/текущая игра/],
    '$1st half goals odd/even': [/голы во? (\d)-й половине неч[её]т(\/|\.)ч[её]т/],
    'current set correct score': [/текущая партия - точный счёт|точный счёт сета/],
    'correct score': [/(точный|финальный) сч[её]т( матча)?/],
    'exact total goals': [/точный тотал голов/],
    'exact $2st half goals': [/точное кол-во голов (за )?(\d)(-й)? половин[уы]/],
    'home team exact goals': [/точное кол-во голов команды (хозяев|гостей)/],
    'exact home goals': [/точное кол-во голов хозяев/],
    'exact away goals': [/точное кол-во голов гостей/],
    'exactly': [/точно/],
    'money line': [/денежная линия/],
    'set betting': [/ставки на сет/],
    'handicap result': [/результат гандикапа/],
    'first half corners': [/угловые первой половины/],
    'team to score': [/команда, заработавшая очки/],
    'half time/full time': [/половина\/основное время/],
    'goal line': [/линия (голов|с азиатским гандикапом)/],
    'number of goals in match': [/кол-во голов в матче/],
    'teams to score': [/забившие команды/],
    'both teams': [/обе команды/],
    'both halves': [/обе половины|оба тайма|в обоих половинах|в обоих таймах/],
    'point spread': [/ставка с форой/],
    'margin of victory': [/победный перевес/],
    'round winner': [/раунд - победитель/],
    'winner': [/победитель/],
    'from behind': [/проигрывая/],
    'either half': [/в одной из половин|один из таймов/],
    'to win': [/выиграет/],
    'draw': [/ничья/],
    ' or ': [/ или /],
    'two games': [/два гейма/],
    '$1game$2': [/(^|\s)(в )?гейм[ае]?($|\s)/],
    '$1two$2': [/(^|\s)двух($|\s)/],
    '$1games$3': [/(^|\s)гейм(ы|ов)($|\s)/],
    'double chance': [/двойной шанс/],
    'match goals': [/голы (в )?матч[ае]/],
    '2nd half goals': [/голы 2-й половины/],
    'asian': [/азиатски[ймех]/],
    'total sets': [/тотал сетов/],
    'total': [/тотал|кол-во/],
    '3-way handicap': [/гандикап с 3 исходами/],
    'handicap': [/гандикап(ом)?/],
    '$1set$2': [/(^|\s|\()сет[ае]?($|\s)/],
    'half$1': [/половин[аыеу](\s+)?(–\s+)?/],
    'period': [/периода?/],
    'first': [/перв(ая|ой|ый|ого)/],
    'second': [/втор(ая|ой|ый|ого)/],
    'last': [/последн(яя|ий)/],
    '$1st': [/(\d+)\-(ю|й|я|г?о)/],
    'current': [/текущ(ий|его)/],
    'next goal': [/следующий гол/],
    'race to': [/гонка до/],
    'next': [/следующ(ий|его|ая)/],
    'overtime': [/овертайма?/],
    ' minutes$1': [/ минуты?( |$)/],
    ' and ': [/ и /],
    'team goals': [/голы команды/],
    'goals': [/голы/],
    ' not to score': [/ не забь[еёю]т/],
    'to score': [/забь[еёю]т/],
    'alternative ': [/альтернативн([^\s]+) /],
    'game': [/игра/],
    'corners': [/углов(ы[хе]|ой)/],
    'over': [/больш[еe]( голов)?/],
    'under': [/м[еe]ньш[еe] ?(голов)?/],
    '$1yes$2': [/(^|\s)да($|\s)/],
    '$1no$2': [/(^|\s)нет($|\s)/],
    '$1goal$2': [/(^|\s)гола($|\s)/],
    '$1 game winner': [/winner (current|next) game/],
    ' $1.$2 ': [/ (\d+),(\d+) /],
    '$1odd/even$2': [/(^|\s)неч[её]т\/ч[её]т($|\s)/],
    '$1odd$2': [/(^|\s)неч[её]т(?:ный)?($|\s)/],
    '$1even$2': [/(^|\s)ч[её]т(?:ный)?($|\s)/],
    'set': [/партия/],
    'point': [/очки/],
    'match': [/матч/],
    'map': [/карт[аы]/],
    'round': [/раунд/],
    'kills': [/убийств/],
    'score': [/(- )?сч[её]т$/],
    'penalty': [/пенальти/],
    ' no bet': [/ - ставка недействительна/]
  };

  private teamTranslations: { [translation: string]: RegExp[] } = {
    '': [/ - женщины| - резерв/ig]
  };

  // var evObj = document.createEvent('Events');
  // evObj.initEvent('click', true, false);
  // var result = [];
  // document.querySelectorAll('[class*="gl-Market_General"] [class*="gl-Market_General"]').forEach((el, index) => {setTimeout(() => {el.dispatchEvent(evObj); setTimeout(() => {var innerItem = document.querySelector('.qbs-NormalBetItem_Details'); window.result.push(innerItem.innerHTML); console.log(index); el.dispatchEvent(evObj);}, 500)}, index * 1000)});

  constructor(private checkService: CheckService, private parserService: ParserService) {
  }

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

  public render(html: string, sport: string): { team1: string, team2: string, bet: string, value: string, check: null | { name: string, parts: string[] } } {
    const clear = ((html + '').replace(/<!--.*?-->/gi, '') + '').replace(/\r|\n/gi, '').trim();
    const title = /.*<div[^>]*class="[^"]*qbs-NormalBetItem_FixtureDescription[^"]*"[^>]*>([^<]*)<\/div>.*/gi.test(clear) ? clear.replace(/.*<div[^>]*class="[^"]*qbs-NormalBetItem_FixtureDescription[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1') : '';
    const team2 = title ? title.replace(/.* +(v|\@) +(.*)$/, '$2').trim() : '';
    const team1 = team2 ? title.replace(team2, '').replace(/ (v|\@) ?$/, '').trim() : '';

    const betMarket = /.*<div[^>]*class="[^"]*qbs-NormalBetItem_Market[^"]*"[^>]*>([^<]*)<\/div>.*/gi.test(clear) ? clear.replace(/.*<div[^>]*class="[^"]*qbs-NormalBetItem_Market[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1').trim() : '';
    const betTitle = /.*<div[^>]*class="[^"]*qbs-NormalBetItem_Title[^"]*"[^>]*>([^<]*)<\/?div.*/gi.test(clear) ? clear.replace(/.*<div[^>]*class="[^"]*qbs-NormalBetItem_Title[^"]*"[^>]*>([^<]*)<\/?div.*/gi, '$1').trim() : '';
    const betHandicap = /.*<div[^>]*class="[^"]*qbs-NormalBetItem_Handicap[^"]*"[^>]*>([^<]*)<\/div>.*/gi.test(clear) ? clear.replace(/.*<div[^>]*class="[^"]*qbs-NormalBetItem_Handicap[^"]*"[^>]*>([^<]*)<\/div>.*/gi, '$1').trim() : '';
    const betString = (betMarket && betTitle ? betMarket + ' - ' + betTitle : '') + (betHandicap ? ' (' + betHandicap + ')' : '');

    // const betParse = this.parser(
    //   this.translate(betTitle.toLowerCase(), false).replace(/\s+/g, ' '),
    //   this.translate(betMarket.toLowerCase(), false).replace(/\s+/g, ' '),
    //   this.translate(team1.toLowerCase(), true).replace(/\s+/g, ' '),
    //   this.translate(team2.toLowerCase(), true).replace(/\s+/g, ' '),
    //   betHandicap,
    //   sport
    // );

    const betParse = this.parserService.parser(betString, team1, team2, sport);
    const betCheck = this.checkService.check(betParse);

    return {team1: team1, team2: team2, bet: betParse, value: betString, check: betCheck};
  }


  public translate(stringToTranslate: string, isTeam: boolean): string {
    const translationsRegExps = isTeam ? this.teamTranslations : this.translationsRegExps;
    for (const translation in translationsRegExps) {
      stringToTranslate = stringToTranslate.replace(translationsRegExps[translation][0], translation);
    }
    return stringToTranslate;
  }

  public parser(betTitle: string, betType: string, team1: string, team2: string, handicapText: string, sport: string) {
    const tennisData = {gamesPlayedInPreviousSets: 2, currentSet: 1};

    return this.parseUniversal(betTitle, betType, team1, team2, handicapText, tennisData, sport);
  }

  public parseUniversal(betTitle: string, betType: string, team1: string, team2: string, handicapText: string, tennisData: TennisData, sport: string): string {
    betType = betType.toLowerCase().trim();
    if (/ and |two games|(?<!(will there be|to go to|will match go to) )overtime|\d+ minutes|result\/(both teams|total goals)|half with most goals|map \d+ - \d\w{2} half|to win either half|both halves|from behind|penalty|red card|yellow card/.test(betType) || /\d+ minutes/.test(betTitle)) {
      return '';
    }
    let bet = '';
    switch (true) {
      case /game winner|next game$/.test(betType) && !/to win \d+\/\d+/.test(betType): {
        const gameNumberMatch = betTitle.match(/([\d]+)[a-z]{2}\sgame/);
        if (gameNumberMatch) {
          let gameNumber = parseInt(gameNumberMatch[1], 10);
          gameNumber = tennisData.gamesPlayedInPreviousSets ? gameNumber - tennisData.gamesPlayedInPreviousSets : gameNumber;
          bet = `GAME__0${tennisData.currentSet || 0}_${gameNumber < 10 ? '0' : ''}${gameNumber}__${betTitle.includes(team1) ? 'P1' : 'P2'}`;
        } else {
          bet = `WIN__${betTitle.indexOf(team1) !== -1 ? 'P1' : 'P2'}`;
        }
      }
        break;
      case /^to qualify$/.test(betType): {
        bet = `WIN_OT__${betTitle.indexOf(team1) !== -1 ? 'P1' : 'P2'}`;
      }
        break;
      case /(half time|2nd half) result|^half-time$/.test(betType): {
        if (betTitle.indexOf('draw') !== -1) {
          bet = `HALF_0${betType.includes('2nd') ? '2' : '1'}__WIN__PX`;
        } else {
          bet = `HALF_0${betType.includes('2nd') ? '2' : '1'}__WIN__${betTitle.indexOf(team1) !== -1 ? 'P1' : 'P2'}`;
        }
      }
        break;
      case /to win to nil/.test(betType): {
        bet = `CLEAN_SHEET__P${betTitle.includes(team1) ? '1' : '2'}__YES`;
      }
        break;
      case /round winner$/.test(betType): {
        const roundMatch = betTitle.match(/round (\d+)/);
        if (roundMatch) {
          bet = `WHO_SCORE__${roundMatch[1].length > 1 ? roundMatch[1] : '0' + roundMatch[1]}__P${betTitle.includes(team1) ? '1' : '2'}`;
        }
      }
        break;
      case /time result|winner|money line|to win|most/.test(betType)
      && !/most kills|to win at least/.test(betType)
      && !/to win \d+\/\d+/.test(betType): {
        if (betTitle.indexOf(' or ') !== -1) {
          if (betTitle.indexOf('draw') !== -1) {
            bet = `WIN__${betTitle.indexOf(team1) !== -1 ? '1X' : 'X2'}`;
          } else {
            bet = `WIN__12`;
          }
        } else {
          if (betTitle.indexOf('draw') !== -1) {
            bet = 'WIN__PX';
          } else {
            bet = `WIN__${betTitle.indexOf(team1) !== -1 ? 'P1' : 'P2'}`;
          }
        }
      }
        break;
      case /draw no bet/.test(betType): {
        bet = `HANDICAP__P${betTitle.includes(team2) ? '2' : '1'}(0)`;
      }
        break;
      case /double chance/.test(betType): {
        const team1str = betTitle.includes(team1) ? '1' : '', draw = betTitle.includes('draw') ? 'X' : '',
          team2str = betTitle.includes(team2) ? '2' : '';
        bet = `WIN__${team1str}${draw}${team2str}`;
        bet = bet.replace(/__X$/, '__PX');
      }
        break;
      case /^handicap result$/.test(betType): {
        const team = betTitle.includes(team1) ? 'P1' : 'P2';
        const score = parseFloat(betTitle.match(/(\(| )([\d+-\.,]+)\)/)[2].replace(',', '.'));
        bet = `HANDICAP_3W__${team}(${score})`;
      }
        break;
      case /(^alternative handicap result|(alternative )?3-way handicap)$/.test(betType): {
        const team = betTitle.includes(team1) ? 'P1' : betTitle.match(/^draw/i) ? 'PX' : 'P2';
        const titleMatch = betTitle.match(/([+-][\d\.,]+)$/) || [];
        const score = parseFloat((titleMatch.length > 1 ? titleMatch[1] : '0').replace(',', '.'));
        bet = `HANDICAP_3W__${team}(${score})`;
      }
        break;
      case /^\d[a-z]{2} half - handicap$/.test(betType): {
        const suffix = ['basketball'].includes(sport) ? '' : '_3W';
        const team = betTitle.includes(team1) ? 'P1' : 'P2';
        const titleMatch = betTitle.match(/([\d+-\.,]+)$/) || [];
        const score = parseFloat((titleMatch.length > 1 ? titleMatch[1] : '0').replace(',', '.'));
        bet = `HANDICAP${suffix}__${team}(${score})`;
      }
        break;
      case /(half|alternative) asian$|asian (handicap|puck line)/.test(betType): {
        const team = betTitle.includes(team1) ? '1' : '2';
        const scoreMatch = betTitle.match(/\((\d+)[-](\d+)\)/);
        const [homeScore, awayScore] = scoreMatch ? scoreMatch.slice(1).map(v => parseFloat(v)) : [0, 0];
        const scoresStrings = handicapText.replace(/([+-]?\d),(\d),([-+]?\d),(\d)/, '$1.$2,$3.$4').split(',');
        let score = scoresStrings.reduce((accumulator, ss) => accumulator + parseFloat(ss), 0) / scoresStrings.length;
        if (team === '1') {
          score -= (homeScore - awayScore);
        } else {
          score -= (awayScore - homeScore);
        }
        bet = `HANDICAP__P${team}(${score})`;
      }
        break;
      case /handicap|puck line|spread/.test(betType): {
        const team = betTitle.includes(team1) ? '1' : '2';
        if (!handicapText) {
          const scoreMatch = betTitle.match(/[+-]?\d+[,\.]\d$/);
          if (scoreMatch) {
            handicapText = scoreMatch[0];
          }
        }
        const score = parseFloat(handicapText);
        if (!/\((games|sets)\)/.test(betType) && !(/^match handicap$/.test(betType) && sport === 'esports')) {
          bet = `HANDICAP__P${team}(${score})`;
        } else {
          bet = `SETS_HANDICAP__P${team}(${score})`;
        }
      }
        break;
      case /^(first half|(alternative )?total|\dst half|2nd half) corners$/.test(betType): {
        const valueMatch = betTitle.match(/(over|under|exactly) ?([0-9\.]+)/);
        if (valueMatch) {
          const overUnderExact = valueMatch[1].replace('ly', '').toUpperCase();
          const value = overUnderExact === 'OVER' ? parseFloat(valueMatch[2]) + 0.5 : overUnderExact === 'UNDER' ? parseFloat(valueMatch[2]) - 0.5 : parseFloat(valueMatch[2]);
          bet = `TOTALS__${overUnderExact}(${value})`;
        }
      }
        break;
      case /^(home|away) team exact goals$/.test(betType): {
        const valueMatch = betTitle.match(/(\d+)(\+)?/);
        const value = valueMatch[2] ? parseFloat(valueMatch[1]) - 0.5 : parseFloat(valueMatch[1]);
        bet = `P${betTitle.includes(team1) ? '1' : '2'}__TOTALS__${valueMatch[2] ? 'OVER' : 'EXACT'}(${value})`;
      }
        break;
      case /^exact (home|away) goals$/.test(betType): {
        const valueMatch = betTitle.match(/(\d+)(\+)?/);
        const value = valueMatch[2] ? parseFloat(valueMatch[1]) - 0.5 : parseFloat(valueMatch[1]);
        bet = `P${betType.includes('home') ? '1' : '2'}__TOTALS__${valueMatch[2] ? 'OVER' : 'EXACT'}(${value})`;
      }
        break;
      case /(home|away) team odd\/even goals/.test(betType): {
        bet = `P${betTitle.includes(team1) ? '1' : '2'}__TOTALS__${betTitle.endsWith('odd') ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^exact (total|1[a-z]{2} half|2[a-z]{2} half) goals$/.test(betType): {
        const valueMatch = betTitle.match(/(\d+)(\+)?/);
        const value = valueMatch[2] ? parseFloat(valueMatch[1]) - 0.5 : parseFloat(valueMatch[1]);
        bet = `TOTALS__${valueMatch[2] ? 'OVER' : 'EXACT'}(${value})`;
      }
        break;
      case /^number of goals in match$/.test(betType): {
        const values = betTitle.match(/\d+/g).map(v => parseFloat(v));
        const overUnderExact = betTitle.includes('over') ? 'OVER' : betTitle.includes('under') ? 'UNDER' : 'EXACT';
        const value = values.length > 1 ? `${values[0]}-${values[1]}` : overUnderExact === 'OVER' ? values[0] + 0.5 : overUnderExact === 'UNDER' ? values[0] - 0.5 : values[0];
        bet = `TOTALS__${overUnderExact}(${value})`;
      }
        break;
      case /^teams to score$/.test(betType): {
        if (betTitle.includes('both teams')) {
          bet = `BOTH_TEAMS_TO_SCORE__YES`;
        } else if (betTitle.includes('no goal')) {
          bet = `NO_ONE_TO_SCORE__YES`;
        } else {
          bet = `ONLY_TEAM_TO_SCORE__P${betTitle.includes(team2) ? '2' : '1'}__YES`;
        }
      }
        break;
      case /^total sets$/.test(betType): {
        const number = betTitle.match(/^(\d+) /);
        if (number) {
          bet = `SETS_TOTALS__EXACT(${number[1]})`;
        }
      }
        break;
      case /total|goal line|games in current set|(team|match|half|alternative) goals|(asian|half) corners|corners.+half/.test(betType)
      && !/total (towers|barons|dragons|inhibitors)/.test(betType): {
        const team = betTitle.includes(team1) ? 'P1__' : betTitle.includes(team2) ? 'P2__' : '';
        const valueMatch = betTitle.match(/(over|under) ?([0-9\.]+)(,[0-9\.]+)?/);
        if (valueMatch) {
          const value = valueMatch[3]
            ? (parseFloat(valueMatch[3].replace(',', '')) + parseFloat(valueMatch[2])) / 2
            : parseFloat(valueMatch[2]);
          bet = `${team}TOTALS__${valueMatch[1].toUpperCase()}(${value})`;
        } else if (/(^| )(odd|even)/.test(betTitle)) {
          bet = `TOTALS__${betTitle.match(/(^| )(odd|even)$/)[2].toUpperCase()}`;
        } else if (/^\d+ - \d+$/.test(betTitle)) {
          bet = `TOTALS__EXACT(${betTitle.replace(/\s/g, '')})`;
        }
      }
        break;
      case /to score/.test(betType) && /(^| - )(yes|no)$|to score/.test(betTitle): {
        const team = betTitle.includes(team1) ? 'TEAM_TO_SCORE__P1__' : betTitle.includes(team2) ? 'TEAM_TO_SCORE__P2__' : 'BOTH_TEAMS_TO_SCORE__';
        const yesNoMatch = betTitle.match(/(^| - )(yes|no)$/);
        if (yesNoMatch) {
          bet = `${team}${yesNoMatch[2].toUpperCase()}`;
        } else {
          bet = `${team}${betTitle.includes('not to score') ? 'NO' : 'YES'}`;
        }
      }
        break;
      case /^half time\/full time$/.test(betType): {
        const [half, match] = betTitle.split(' - ');
        const bet1 = half.includes(team1) ? 'P1' : half.includes(team2) ? 'P2' : 'PX';
        const bet2 = match.includes(team1) ? 'P1' : match.includes(team2) ? 'P2' : 'PX';
        bet = `WIN_HALF_MATCH__${bet1}_${bet2}`;
      }
        break;
      case /^(first half |half time |(current|next) game - )?(correct|final) score$/.test(betType): {
        const scoreMatch = betTitle.match(/(\d+)\-(\d+)/);
        if (scoreMatch && !betTitle.includes(' or better')) {
          const score = betTitle.includes(team2) ? `${scoreMatch[2]}:${scoreMatch[1]}` : `${scoreMatch[1]}:${scoreMatch[2]}`;
          bet = `CORRECT_SCORE(${score})`;
          if (betType.includes('half time')) {
            bet = `HALF_01__${bet}`;
          }
        }
      }
        break;
      case /^(correct (map|set|game) score|current set correct score$|set betting$|current set score$)/.test(betType): {
        const scoreMatch = betTitle.match(/(\d+)\-(\d+)/);
        if (scoreMatch && !betTitle.includes(' or better')) {
          const score = betTitle.includes(team2) ? `${scoreMatch[2]}:${scoreMatch[1]}` : `${scoreMatch[1]}:${scoreMatch[2]}`;
          bet = `CORRECT_SCORE(${score})`;
        }
      }
        break;
      case /^next goal$/.test(betType): {
        const goalNum = betTitle.match(/(to score|no) (\d+)[a-z]{2}/)[2];
        const team = betTitle.includes(team1) ? 'P1' : betTitle.includes(team2) ? 'P2' : 'NO';
        bet = `WHO_SCORE_3W__${goalNum.length > 1 ? goalNum : '0' + goalNum}__${team}`;
      }
        break;
      case /^point betting$/.test(betType): {
        const titleMatch = betTitle.match(/point (\d+)/) || [];
        const point = titleMatch.length > 1 ? titleMatch[1] : '0';
        const player = betTitle.includes(team1) ? 'P1' : 'P2';
        bet = `WHO_SCORE__${point.length > 1 ? point : `0${point}`}__${player}`;
      }
        break;
      case /^(current|next) (game|set) (- )?race to/.test(betType): {
        const point = (betType.match(/race to (\d+)/) || betTitle.match(/race to (\d+)/))[1];
        const player = betTitle.includes(team1) ? 'P1' : 'P2';
        bet = `FIRST_TO_SCORE__${point.length > 1 ? point : '0' + point}__${player}`;
      }
        break;
      case /race to \d+ kills$/.test(betType): {
        const point = betType.match(/race to (\d+)/)[1];
        const player = betTitle.includes(team1) ? 'P1' : 'P2';
        bet = `FIRST_TO_SCORE__${point.length > 1 ? point : '0' + point}__${player}`;
      }
        break;
      case /race to \d+ corners$/.test(betType): {
        const point = betType.match(/race to (\d+)/)[1];
        const player = betTitle.includes(team1) ? 'P1' : betTitle.includes(team2) ? 'P2' : 'NO';
        bet = `FIRST_TO_SCORE_3W__${point.length > 1 ? point : '0' + point}__${player}`;
      }
        break;
      case /(to go to|current set|will there be|will match go to) (extra points|overtime\??)$/.test(betType): {
        bet = `WILL_BE_OT__${betTitle.endsWith('yes') ? 'YES' : 'NO'}`;
      }
        break;
      case /team to draw first blood/.test(betType): {
        bet = `WHO_SCORE__01__${betTitle.includes(team2) ? 'P2' : 'P1'}`;
      }
        break;
      case /^first team to score$/.test(betType): {
        bet = `WHO_SCORE_3W__01__${betTitle.includes(team1) ? 'P1' : betTitle.includes(team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /^last (team to score|corner)$/.test(betType): {
        bet = `LAST_TEAM_TO_SCORE__${betTitle.includes(team1) ? 'P1' : betTitle.includes(team2) ? 'P2' : 'NO'}`;
      }
        break;
      case /^(match|current set|goals|game total) odd\/even$/.test(betType): {
        bet = `TOTALS__${betTitle.endsWith('odd') ? 'ODD' : 'EVEN'}`;
      }
        break;
      case /^(alternative )?corners( 2-way)?$/.test(betType): {
        const valueMatch = betTitle.match(/(over|under|exactly) ?([0-9\.]+)/);
        if (valueMatch) {
          const overUnderExact = valueMatch[1].replace('ly', '').toUpperCase();
          const suffix = betType.includes('2-way') ? '' : '_3W';
          const value = suffix ? (overUnderExact === 'OVER' ? parseFloat(valueMatch[2]) + 0.5 : overUnderExact === 'UNDER' ? parseFloat(valueMatch[2]) - 0.5 : parseFloat(valueMatch[2])) : parseFloat(valueMatch[2]);
          bet = `TOTALS${suffix}__${overUnderExact}(${value})`;
        }
      }
        break;
      case /^clean sheet$/.test(betType): {
        bet = `CLEAN_SHEET__P${betTitle.includes(team1) ? '1' : '2'}__${betTitle.match(/yes$/i) ? 'YES' : 'NO'}`;
      }
        break;
    }
    if (bet && !/^(GAME|HALF)_/.test(bet)) {
      const periodPrefix = this.GetPeriodPrefix(betType, betTitle, tennisData.currentSet);
      if (periodPrefix) {
        bet = `${periodPrefix}__${bet}`;
      }
    }
    if (betType.includes('corners') && bet) {
      bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?|SCORE(_3W)?)/g, '$1_CORNERS');
    }
    if (!/^(SET|HALF)/.test(bet)) {
      if (sport === 'basketball') {
        if ((betType.includes('3 исхода') || betType.includes('3-way')) && bet.includes('WIN')) {
          bet = bet.replace(/(WIN)__/, '$1_RT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?)__/, '$1_OT__');
        }
      } else if (sport === 'hockey') {
        if (!(betType.includes('3 исхода') || betType.includes('3-way')) && bet.includes('WIN')) {
          bet = bet.replace(/(WIN)__/, '$1_OT__');
        } else {
          bet = bet.replace(/(WIN|TOTALS(_3W)?|HANDICAP(_3W)?)__/, '$1_RT__');
        }
      }
    }
    return bet;
  }

  private GetPeriodPrefix(betType: string, betTitle: string, currentPeriod?: number): string {
    return this.GetPeriodPrefixFromString(betTitle.toLowerCase(), currentPeriod) || this.GetPeriodPrefixFromString(betType, currentPeriod);
  }

  private GetPeriodPrefixFromString(period: string, currentPeriod?: number): string {
    let periodPrefix = '';
    const periodTypeMatches = period.match(/(period|set|quarter|half|game|map)/);
    if (periodTypeMatches) {
      let periodType = '';
      if (['quarter', 'set', 'period', 'game', 'map'].includes(periodTypeMatches[1])) {
        periodType = `SET`;
      } else {
        periodType = `HALF`;
      }
      const charPeriod = period.match(/(first|second|third|fourth)/);
      if (charPeriod) {
        periodPrefix = `${periodType}_${['first', 'second', 'third', 'fourth'].indexOf(charPeriod[1]) + 1}`;
      } else {
        const numPeriod = period.match(/(.*)(\d+)([a-z]{2})/) || period.match(/(set|period|game|map) (\d+)/);
        if (numPeriod) {
          periodPrefix = `${periodType}_${numPeriod[2]}`;
        } else {
          const relativePeriod = period.match(/next|current/);
          if (relativePeriod && currentPeriod) {
            if (relativePeriod[0] === 'next') {
              periodPrefix = `${periodType}_${currentPeriod + 1}`;
            } else {
              periodPrefix = `${periodType}_${currentPeriod + 1}`;
            }
          }
        }
      }
    }
    return periodPrefix;
  }
}
