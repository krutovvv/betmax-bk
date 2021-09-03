const fs = require('fs');

/**
 * @param betString {string}
 * @param team1 {string}
 * @param team2 {string}
 * @param sport {string}
 * @returns {string}
 */
function parser(betString, team1, team2, sport) {
  const stops = [
    /п1.*или/iu, /п2.*или/iu, /результат матча и тотал/iu,
    /будет.*и не/iu, /результативность/iu, / и тм/iu,
    /тайме или матче/iu, /в один мяч.*или/iu, /с разницей в/iu,
    /сам.*результат/iu, /победа.*нет/iu, /каждая.*забьет/iu,
    /во всех/iu, /в компенсир/iu, /результат без победы/iu,
    /победит в/iu, /в 2 гол/iu, /в одном из/iu,
    /удаление/iu, /замена/iu, / мин/iu,
    /нечётный тотал/iu, /четный тотал/iu, /оба/iu,
    /сек/iu, /раньше/iu, /обоих/iu,
    /хотя бы/iu, /красн/iu, /подряд/iu,
    /ничья.*нет/iu, / и обе/iu,
    / и выиграет/iu, / и не выиграет/iu, / и проиграет/iu,
    / и ничья/iu, / и тб/iu, / \+ /iu,
    /с преимуществом .*в .*/iu, /супертотал/iu,
    /суперфора/iu, /тотал розыгрышей/iu,
    /трехисходный/iu, /счет по четвертям/iu, /победа по четвертям/iu
  ];

  if (stops.map(regexp => regexp.test(betString)).indexOf(true) !== -1) {
    return '';
  }

  let period = '';
  switch (true) {
    case /(1-й|1-м|1-ом|1-я|1|первый) тай|тайм 1/iu.test(betString):
      period = 'HALF_01';
      break;
    case /(2-й|2-м|2-ом|2-я|2|второй) тай|тайм 2/iu.test(betString):
      period = 'HALF_02';
      break;
    case /(1-й|1-м|1-ом|1-я|1|первый|в) (сет|сэт|партия|период|четверть|четверти|карта|map)|(сет|сэт|партия|период|четверть|четверти|карта|map) 1/iu.test(betString):
      period = 'SET_01';
      break;
    case /(2-й|2-м|2-ом|2-я|2|второй) (сет|сэт|партия|период|четверть|четверти|карта|map)|(сет|сэт|партия|период|четверть|четверти|карта|map) 2/iu.test(betString):
      period = 'SET_02';
      break;
    case /(3-й|3-м|3-ом|3-я|3|третий) (сет|сэт|партия|период|четверть|четверти|карта|map)|(сет|сэт|партия|период|четверть|четверти|карта|map) 3/iu.test(betString):
      period = 'SET_03';
      break;
    case /(4-й|4-м|4-ом|4-я|4|четвертый) (сет|сэт|партия|период|четверть|четверти|карта|map)|(сет|сэт|партия|период|четверть|четверти|карта|map) 4/iu.test(betString):
      period = 'SET_04';
      break;
    case /(5-й|5-м|5-ом|5-я|5|пятый) (сет|сэт|партия|период|четверть|четверти|карта|map)|(сет|сэт|партия|период|четверть|четверти|карта|map) 5/iu.test(betString):
      period = 'SET_05';
      break;
  }
  let team = '';
  switch (true) {
    case /или ничья/iu.test(betString) && (/: +1( +\(|$)/.test(betString) || /(1-й|1) ком/.test(betString) || /пер[^ ]* ком/iu.test(betString) || betString.indexOf(team1) !== -1):
      team = `1X`;
      break;
    case /или ничья/iu.test(betString) && (/: +2( +\(|$)/.test(betString) || /(2-й|2) ком/.test(betString) || /вто[^ ]* ком/iu.test(betString) || betString.indexOf(team2) !== -1):
      team = `2X`;
      break;
    case / 1(x|х) | 1(x|х)$/iu.test(betString):
      team = `1X`;
      break;
    case /двойной шанс.*не проиграет/iu.test(betString) && betString.indexOf(team1) !== -1:
      team = `1X`;
      break;
    case /любой из|не будет ничьи|двойной шанс.* 12| 12$/iu.test(betString):
      team = `12`;
      break;
    case / 2(x|х) | 2(x|х)$| (x|х)2 | (x|х)2$/iu.test(betString):
      team = `X2`;
      break;
    case /двойной шанс.*не проиграет/iu.test(betString) && betString.indexOf(team2) !== -1:
      team = `X2`;
      break;
    case /ничья|наиб.*кол.*очк.*никто/iu.test(betString) && !/нулев.*ничья/iu.test(betString):
      team = 'PX';
      break;
    case /(перв|посл).*гол.*никто|забь?(е|ё)т.*следующ.*\(?1\)?.*гол.*никто|следующий гол.*не будет/iu.test(betString):
      team = 'NO';
      break;
    case /: +1( +\(|$)/.test(betString):
      team = 'P1';
      break;
    case /: +2( +\(|$)/.test(betString):
      team = 'P2';
      break;
    case /(1-й|1) ком/.test(betString):
      team = 'P1';
      break;
    case /(2-й|2) ком/.test(betString):
      team = 'P2';
      break;
    case /пер[^ ]* ком/iu.test(betString):
      team = 'P1';
      break;
    case /вто[^ ]* ком/iu.test(betString):
      team = 'P2';
      break;
    case betString.indexOf(team1) !== -1:
      team = 'P1';
      break;
    case betString.indexOf(team2) !== -1:
      team = 'P2';
      break;
    case /команда 1/iu.test(betString):
      team = 'P1';
      break;
    case /команда 2/iu.test(betString):
      team = 'P2';
      break;
    case /(фора|индивидуальный тотал|трехпутевой тотал) 1/iu.test(betString):
      team = 'P1';
      break;
    case /(фора|индивидуальный тотал|трехпутевой тотал) 2/iu.test(betString):
      team = 'P2';
      break;
    case /фора (по|на) (парти|сет|четвер|раунд)[^ ]* 1/iu.test(betString):
      team = 'P1';
      break;
    case /фора (по|на) (парти|сет|четвер|раунд)[^ ]* 2/iu.test(betString):
      team = 'P2';
      break;
    case / П1/iu.test(betString):
      team = 'P1';
      break;
    case / П2/iu.test(betString):
      team = 'P2';
      break;
    case / X$| Х$/iu.test(betString):
      team = 'PX';
      break;
  }
  let direction = '';
  switch (true) {
    case / больше|\(5\+\)|точн.*бол|кол.*гол.*матче.* (бол|мен)/iu.test(betString):
      direction = 'OVER';
      break;
    case / меньше|точн.*мен/iu.test(betString):
      direction = 'UNDER';
      break;
    case / Б | Б$/u.test(betString):
      direction = 'OVER';
      break;
    case / М | М$/u.test(betString):
      direction = 'UNDER';
      break;
    case /равно|ровно|нулев/iu.test(betString):
      direction = 'EXACT';
      break;
    case /бьет.*[0-9] или [0-9]/iu.test(betString):
      direction = 'EXACT';
      break;
    case /точн/iu.test(betString) && !/точный счет/iu.test(betString) && !/бол|мен/iu.test(betString):
      direction = 'EXACT';
      break;
    case /голов в матче|сколько|диапазон.*гол|точное количество/iu.test(betString):
      direction = 'EXACT';
      break;
  }
  let coff = '';
  switch (true) {
    case /количество/iu.test(betString) && /без гол/iu.test(betString):
      coff = '(0)';
      break;
    case /нулев.*ничья/iu.test(betString):
      coff = '(0)';
      break;
    case /\((\+?-?[0-9.]*)\)/.test(betString):
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
      coff = parseFloat(betString.replace(/.*\([0-9-]*\)/, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /точное.*кол.*гол.*- +[0-9]{1,3}.*да/iu.test(betString):
      coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /точное.*кол.*гол.*\([0-9]{1,3}.*\).*да/iu.test(betString):
      coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /кол.*гол.*\([0-9]{1,3}.*(бол|мен).*\).*да/iu.test(betString):
      coff = parseFloat(betString.replace(/.*([0-9]{1,3})/, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /сколько/iu.test(betString) && /[0-9]$/iu.test(betString):
      coff = parseFloat(betString.replace(/.*([0-9])$/, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /кол.*гол/iu.test(betString) && /[0-9]\+?$/iu.test(betString):
      coff = parseFloat(betString.replace(/.*([0-9])\+?$/, '$1'));
      coff = `(${coff - 0.5})`;
      break;
    case /точное кол[^ ]* .* [0-9]+ и (бол|мен)/iu.test(betString):
      coff = parseFloat(betString.replace(/.*точное кол[^ ]* .* ([0-9]+) и (бол|мен).*/iu, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff - 0.5})` : /мен/iu.test(betString) ? `(${coff + 0.5})` : `(${coff})`;
      break;
    case /трехпутевой тотал.* [0-9]*$/iu.test(betString):
      coff = parseFloat(betString.replace(/.*трехпутевой тотал.* ([0-9]*)$/iu, '$1'));
      coff = /бол/iu.test(betString) ? `(${coff + 0.5})` : /мен/iu.test(betString) ? `(${coff - 0.5})` : `(${coff})`;
      break;
    case /фора.* +-?\+?[0-9.]{1,5}|тотал.* +-?\+?[0-9.]{1,5}$/iu.test(betString):
      coff = parseFloat(betString.replace(/.* +([0-9-+.]{1,5})$/, '$1'));
      coff = `(${coff})`;
      break;
    case /тотал +-?\+?[0-9.]{1,5}/iu.test(betString):
      coff = parseFloat(betString.replace(/.*тотал +([0-9-+.]{1,5}).*/iu, '$1'));
      coff = `(${coff})`;
      break;
  }
  let score = '';
  switch (true) {
    case /европейский гандикап.* [0-9]{1,3}:[0-9]{1,3}/iu.test(betString):
      const s1 = parseInt(betString.replace(/.*европейский гандикап.* ([0-9]{1,3}):[0-9]{1,3}.*/iu, '$1'), 10);
      const s2 = parseInt(betString.replace(/.*европейский гандикап.* [0-9]{1,3}:([0-9]{1,3}).*/iu, '$1'), 10);
      score = `(${team === 'P1' ? s2 - s1 : s1 - s2})`;
      break;
    case /бьет.* [0-9] или [0-9]/iu.test(betString):
      score = `(${betString.replace(/.* ([0-9]{1,3}) или ([0-9]{1,3}).*/iu, '$1-$2')})`;
      break;
    case /кол.*голов.*\([0-9]+-[0-9]+\)/iu.test(betString):
      score = `(${betString.replace(/.*кол.*голов.*\(([0-9]+)-([0-9]+)\).*/iu, '$1-$2')})`;
      break;
    case /точное количество.* [0-9]+ ?- ?[0-9]+/iu.test(betString):
      score = `(${betString.replace(/.*точное количество.* ([0-9]+) ?- ?([0-9]+).*/iu, '$1-$2')})`;
      break;
    case /диапазон.*[0-9]{1,3}-[0-9]{1,3}|кол.* голов в матче.*[0-9]{1,3}-[0-9]{1,3}/iu.test(betString):
      score = `(${betString.replace(/.*([0-9]{1,3}-[0-9]{1,3}).*/iu, '$1')})`;
      break;
    case /([0-9]{1,3}:[0-9]{1,3})/iu.test(betString):
      score = `(${betString.replace(/.*([0-9]{1,3}:[0-9]{1,3}).*/iu, '$1')})`;
      break;
    case /([0-9]{1,3}-[0-9]{1,3})/iu.test(betString):
      score = `(${betString.replace(/.*([0-9]{1,3})-([0-9]{1,3}).*/iu, '$1:$2')})`;
      break;
    case /гонка до [0-9]*/iu.test(betString):
      score = `(${betString.replace(/.*гонка до ([0-9]*).*/iu, '$1')})`;
      break;
    case /.*фора [1-2] [0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/.*фора [1-2] ([0-9.-]+).*/iu, '$1')})`;
      break;
    case /.*фора по (партиям|сетам|четвертям) [1-2] [0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/.*фора по (партиям|сетам|четвертям) [1-2] ([0-9.-]+).*/iu, '$2')})`;
      break;
    case /.*индивидуальный тотал [1-2]-[а-я]{2} [1-2]-[а-я] сет [0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/.*индивидуальный тотал [1-2]-[а-я]{2} [1-2]-[а-я] сет ([0-9.-]+).*/iu, '$1')})`;
      break;
    case /.*индивидуальный тотал [1-2](-го | )[0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/.*индивидуальный тотал [1-2](-го | )([0-9.-]+).*/iu, '$2')})`;
      break;
    case /^тотал [1-2]-[а-я] сет [0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/^тотал [1-2]-[а-я] сет ([0-9.-]+).*/iu, '$1')})`;
      break;
    case /^тотал [-]?[0-9.]+.*/iu.test(betString):
      score = `(${betString.replace(/^тотал ([-]?[0-9.]+).*/iu, '$1')})`;
      break;
    case /^азиатский тотал [-]?[0-9.]+.*/iu.test(betString):
      score = `(${betString.replace(/^азиатский тотал ([-]?[0-9.]+).*/iu, '$1')})`;
      break;
    case /^фора [1-2]-[а-я] сет [0-9] [0-9.-]+.*/iu.test(betString):
      score = `(${betString.replace(/^фора [1-2]-[а-я] сет [0-9] ([0-9.-]+).*/iu, '$1')})`;
      break;
  }
  let odd_event = '';
  switch (true) {
    case /неч(е|ё)т(н|\.).* нет$/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case /неч(е|ё)т(н|\.)?$/iu.test(betString):
      odd_event = 'ODD';
      break;
    case / ч(е|ё)т(н|\.).* нет$/iu.test(betString):
      odd_event = 'ODD';
      break;
    case / ч(е|ё)т(н|\.)?$/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case /неч(е|ё)тн.* нет/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case /неч(е|ё)тн/iu.test(betString):
      odd_event = 'ODD';
      break;
    case / ч(е|ё)т(н|\.).* нет/iu.test(betString):
      odd_event = 'ODD';
      break;
    case / ч(е|ё)т(н|\.).* да/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case / ч(е|ё)т(н|\.)/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case /^ч(е|ё)т(н|\.).* нет/iu.test(betString):
      odd_event = 'ODD';
      break;
    case /^ч(е|ё)т(н|\.)/iu.test(betString):
      odd_event = 'EVEN';
      break;
    case / ч(е|ё)т .* ?нет/iu.test(betString):
      odd_event = 'ODD';
      break;
    case / ч(е|ё)т .* ?да/iu.test(betString):
      odd_event = 'EVEN';
      break;
  }
  let type = '';
  switch (true) {
    case /Победа в гейме/iu.test(betString):
      type = `GAME`;
      break;
    case /забьет последний гол/iu.test(betString):
      type = `LAST_TO_SCORE_3W`;
      break;
    case /тайм забьет|забьет:/iu.test(betString):
      type = `TEAM_TO_SCORE`;
      break;
    case /тайм забьет|забьет:|забьет[^0-9]* да|забьет[^0-9]* нет|забьет.*тайм.* да|забьет.*тайм.* нет/iu.test(betString):
      type = `TEAM_TO_SCORE`;
      break;
    case /тотал углов/iu.test(betString):
      type = `TOTALS_CORNERS`;
      break;
    case /тотал.*(в|по).*(сет|сэт|парт|перио)/iu.test(betString):
      type = `SETS_TOTALS`;
      break;
    case /нечет|нечёт| четн| чётн| чет\.| чёт\./iu.test(betString):
      type = 'TOTALS';
      break;
    case /забьет|тотал|кол.*гол|диапазон.*гол|итог|точное кол.* очков/iu.test(betString):
      type = `TOTALS`;
      break;
    case /фора.*углов/iu.test(betString):
      type = `HANDICAP_CORNERS`;
      break;
    case /фора по.*(сет|сэт|партия|период|четвер)/iu.test(betString):
      type = `SETS_HANDICAP`;
      break;
    case /европейский гандикап/iu.test(betString):
      type = `HANDICAP_3W`;
      break;
    case /фора|гандикап/iu.test(betString):
      type = `HANDICAP`;
      break;
    case /проход.*полный матч/iu.test(betString):
      type = `WIN_OT`;
      break;
    case /1 ?(х|x) ?2 углов/iu.test(betString):
      type = `WIN_CORNERS`;
      break;
    case /наберет.*очки.*первой|победитель [0-9]{1,3} раунда|поинты .* в .*гейме/iu.test(betString):
      type = `WHO_SCORE`;
      break;
    case /победа|ничья|проход|исход|выход|выйдет|наиб.*кол.*очк|результат|победитель|не проиграет|winner|двойной шанс|углов|1x2/iu.test(betString) && !/результативная/iu.test(betString):
      type = `WIN`;
      break;
    case /обе.*забьют.*да/iu.test(betString):
      type = `BOTH_TEAMS_TO_SCORE`;
      break;
    case /обе.*забьют.*нет/iu.test(betString):
      type = `BOTH_TEAMS_TO_SCORE`;
      break;
    case /точный счет|счет: |период:.*счет/iu.test(betString):
      type = `CORRECT_SCORE`;
      break;
    case /первый гол|забьёт следующий \(1\) гол|следующий гол/iu.test(betString):
      type = `WHO_SCORE_3W`;
      break;
    case /последний гол|наберет очки последней/iu.test(betString):
      type = `LAST_TEAM_TO_SCORE`;
      break;
    case /в.*сухую|победит и не пропустит|выиг.*все.*четв.* да/iu.test(betString):
      type = `CLEAN_SHEET`;
      break;
    case /НН|НП1|НП2|П1Н|П1П1|П1П2|П2Н|П2П1|П2П2/u.test(betString):
      type = `WIN_HALF_MATCH`;
      break;
    case /гол.*в.*тайме|^гол [1-2]-й тайм|^гол в матче/iu.test(betString):
      type = `NO_ONE_TO_SCORE`;
      break;
    case /тай.*брейк.*матч|будет.*тай.*брейк/iu.test(betString):
      type = `WILL_BE_OT`;
      break;
    case /гонка до|первым наберёт/iu.test(betString):
      type = `FIRST_TO_SCORE`;
      break;
  }
  let yes_no = '';
  switch (true) {
    case /в.*сухую.* да|победит и не пропустит.* да|тайм забьет.* да|гол.*в.*тайме.* нет|забьет:.* да|выиг.*все.*четв.* да|тай.*брейк.*матч.* да|забьет[^0-9]* да|забьет.*тайм.* да|^гол [1-2]-й тайм.* нет|^гол в матче.* нет|будет.*тай.*брейк.* да|обе.*забьют.* да/iu.test(betString) && !/точное/iu.test(betString):
      yes_no = `YES`;
      break;
    case /в.*сухую.* нет|победит и не пропустит.* нет|тайм забьет.* нет|гол.*в.*тайме.* да|забьет:.* нет|тай.*брейк.*матч.* нет|забьет[^0-9]* нет|забьет.*тайм.* нет|^гол [1-2]-й тайм.* да|^гол в матче.* да|будет.*тай.*брейк.* нет|обе.*забьют.* нет/iu.test(betString) && !/точное/iu.test(betString):
      yes_no = `NO`;
      break;
    case /в.*сухую.*/iu.test(betString) && !/ да | нет | да$| нет$/iu.test(betString):
      yes_no = `YES`;
      break;
  }
  let win_draw = '';
  switch (true) {
    case /НН/u.test(betString):
      win_draw = `PX_PX`;
      break;
    case /НП1/u.test(betString):
      win_draw = `PX_P1`;
      break;
    case /НП2/u.test(betString):
      win_draw = `PX_P2`;
      break;
    case /П1Н/u.test(betString):
      win_draw = `P1_PX`;
      break;
    case /П1П1/u.test(betString):
      win_draw = `P1_P1`;
      break;
    case /П1П2/u.test(betString):
      win_draw = `P1_P2`;
      break;
    case /П2Н/u.test(betString):
      win_draw = `P2_PX`;
      break;
    case /П2П1/u.test(betString):
      win_draw = `P2_P1`;
      break;
    case /П2П2/u.test(betString):
      win_draw = `P2_P2`;
      break;
  }
  let points = '';
  switch (true) {
    case /.* [0-9]+-?[^ ]? поинт.*/iu.test(betString):
      points = ('0' + betString.replace(/.* ([0-9]+)-?[^ ]? поинт.*/iu, '$1')).substr(-2);
      break;
    case /.*[0-9]+ очков.*/iu.test(betString):
      points = ('0' + betString.replace(/.*?([0-9]+) очков.*/iu, '$1')).substr(-2);
      break;
    case /следующий гол.* ([0-9]+)-[^ ]* гол/iu.test(betString):
      points = ('0' + betString.replace(/.*следующий гол.* ([0-9]+)-[^ ]* гол.*/iu, '$1')).substr(-2);
      break;
    case /.*победитель [0-9]+ раунда.*/iu.test(betString):
      points = ('0' + betString.replace(/.*победитель ([0-9]+) раунда.*/iu, '$1')).substr(-2);
      break;
    case /первый гол|забьёт следующий \(1\)|наберет.*очки.*первой/iu.test(betString):
      points = '01';
      break;
  }
  let games = '';
  switch (true) {
    case /.* гейм ([0-9]+).*/iu.test(betString):
      games = ('0' + betString.replace(/.* гейм ([0-9]+).*/iu, '$1')).substr(-2);
      break;
    case /.* [0-9]+-?[^ ]? гейм.*/iu.test(betString):
      games = ('0' + betString.replace(/.* ([0-9]+)-?[^ ]? гейм.*/iu, '$1')).substr(-2);
      break;
  }

  if (sport === 'hockey' && !period && !/ 1x | 2x | x2 | 12 | 1x$| 2x$| x2$| 12$| 1х | 2х | х2 | 1х$| 2х$| х2$/iu.test(betString)) {
    let ot_rt = 'RT';
    if (/овер|OT|булл|полный матч|не проиграет|победа в матче/iu.test(betString) && !/ без |двойной шанс/iu.test(betString)) {
      ot_rt = 'OT';
    }
    switch (type) {
      case 'CORRECT_SCORE':
        type = `${type}_${ot_rt}`;
        break;
      case 'TOTALS':
        type = `${type}_${ot_rt}`;
        break;
      case 'HANDICAP':
        type = `${type}_${ot_rt}`;
        break;
      case 'WIN':
        type = `${type}_${ot_rt}`;
        break;
    }
  } else if (sport === 'basketball' && !period) {
    let ot_rt = 'OT';
    if (/к концу второй половины|к концу.*2.*половины|к концу четвертой четверти|к концу.*4.*четверти|без.*овертайма|на основное время|результат матча/iu.test(betString) && !/ без /iu.test(betString)) {
      ot_rt = 'RT';
    }
    switch (type) {
      case 'CORRECT_SCORE':
        type = `${type}_${ot_rt}`;
        break;
      case 'TOTALS':
        type = `${type}_${ot_rt}`;
        break;
      case 'HANDICAP':
        type = `${type}_${ot_rt}`;
        break;
      case 'WIN':
        type = `${type}_${ot_rt}`;
        break;
    }
  } else if (sport === 'football' && !period && /выход|выйдет/u.test(betString)) {
    type = `${type}_OT`;
  }

  if (/инд\. тотал/ui.test(betString) && betString.indexOf(team1) === -1 && betString.indexOf(team2) === -1) {
    return '';
  } else if (type) {
    if (type === 'GAME') {
      return ([[type, [period.replace(/[^0-9]*/g, ''), games, points].filter(i => !!i).join('_'), team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
    } else if (win_draw) {
      if (!direction || (direction && (score || coff))) {
        if (score || coff) {
          return ([[type, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        } else {
          return ([[type, [games, points].filter(i => !!i).join('_'), direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
        }
      } else {
        return '';
      }
    } else {
      if (direction === 'EXACT' || type === 'TOTALS' || type === 'TOTALS_OT' || type === 'TOTALS_RT') {
        if (!direction || (direction && (score || coff))) {
          if (score || coff) {
            return ([[period, team, type, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
          } else {
            return ([[period, team, type, [games, points].filter(i => !!i).join('_'), direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
          }
        } else {
          return '';
        }
      } else {
        if (!direction || (direction && (score || coff))) {
          if (score || coff) {
            return ([[period, type, team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
          } else {
            return ([[period, type, [games, points].filter(i => !!i).join('_'), team, direction, odd_event, yes_no, win_draw].filter(i => !!i).join('__'), !odd_event && !win_draw ? score || coff : ''].filter(i => !!i).join('') || '').trim();
          }
        } else {
          return '';
        }
      }
    }
  }
}

/**
 * @param json {Array<{team1: string, team2: string, type: string, coff: string, html: string, test: string}>}
 * @param sport {string}
 * @returns {Array<{team1: string, team2: string, type: string, coff: string, html: string, test: string}>}
 */
function data(json, sport) {
  for (let i = 0; i < json.length; i++) {
    if (!json[i].test) {
      json[i].test = parser(json[i].type, json[i].team1, json[i].team2, sport);
    }
  }
  return json;
}


// const json = JSON.parse(fs.readFileSync('src/app/data/favbet/cs.json', {encoding: 'utf8'}));
// const update = data(json, 'cs');
// fs.writeFileSync('src/app/data/favbet/cs.json', JSON.stringify(update, null, 2));
