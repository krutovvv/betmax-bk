import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private enList = [
    {search: /both teams to score/iu, replace: 'обе забьют'},
    {search: /which team wins the rest of the match/iu, replace: 'выиграет остаток матча'},
    {search: /any team to win.* yes/iu, replace: 'двойной шанс 12'},
    {search: /will there be/iu, replace: 'будет ли'},
    {search: /point handicap/iu, replace: 'фора на матч'},
    {search: /when will the/iu, replace: 'когда будет'},
    {search: /will there be overtime/iu, replace: 'будет ли овертайм'},
    {search: /exact games/iu, replace: 'тотал геймов'},
    {search: /to win a set/iu, replace: 'выйграет сет'},
    {search: /last team to score/iu, replace: 'последний гол'},
    {search: /double result/iu, replace: 'двойной результат'},
    {search: /([^\w]|^)asian total([^\w]|$)/giu, replace: '$1азиатский тотал$2'},
    {search: /([^\w]|^)asian handicap([^\w]|$)/giu, replace: '$1азиатский гандикап$2'},
    {search: /([^\w]|^)total corners?([^\w]|$)/giu, replace: '$1тотал угловых$2'},
    {search: /([^\w]|^)corner handicap([^\w]|$)/giu, replace: '$1фора угловых$2'},
    {search: /([^\w]|^)correct score([^\w]|$)/giu, replace: '$1точный счет$2'},
    {search: /([^\w]|^)double chance([^\w]|$)/giu, replace: 'двойной шанс'},
    {search: /clean sheet|to win to nil/giu, replace: 'в сухую'},
    {search: /([^\w]|^)(winning margin|margin of victory)([^\w]|$)/giu, replace: '$1победный перевес$3'},
    {search: /([^\w]|^)(winner|winning|wins|to win|win)([^\w]|$)/giu, replace: '$1победа$3'},
    {search: /([^\w]|^)no bet([^\w]|$)/giu, replace: '$1нет ставки$2'},
    {search: /([^\w]|^)to score([^\w]|$)/giu, replace: '$1забьет$2'},
    {search: /([^\w]|^)not to score([^\w]|$)/giu, replace: '$1не забьет$2'},
    {search: /([^\w]|^)odd\/even([^\w]|$)/giu, replace: '$1тотал$2'},
    {search: /([^\w]|^)([0-9]+)nd goal/giu, replace: '$1$2-й гол'},
    {search: /exact goals?: ([0-9]+)(\+?)/giu, replace: 'точное количество голов $1$2 голы'},
    {search: /([0-9]+)(th|nd|rd)/giu, replace: '$1'},
    {search: /([^\w]|^)fulltime([^\w]|$)/giu, replace: '$1полное время$2'},
    {search: /([^\w]|^)halftime([^\w]|$)/giu, replace: '$1тайм$2'},
    {search: /([^\w]|^)1st([^\w]|$)/giu, replace: '$1первый$2'},
    {search: /([^\w]|^)race to([^\w]|$)/giu, replace: '$1гонка до$2'},
    {search: /([^\w]|^)exact goals([^\w]|$)/giu, replace: '$1точное количество голов$2'},
    {search: /([^\w]|^)halves?([^\w]|$)/giu, replace: '$1половины$2'},
    {search: /([^\w]|^)handicap([^\w]|$)/giu, replace: '$1гандикап$2'},
    {search: /([^\w]|^)total([^\w]|$)/giu, replace: '$1тотал$2'},
    {search: /([^\w]|^)overtime([^\w]|$)/giu, replace: '$1овертайм$2'},
    {search: /([^\w]|^)over([^\w]|$)/giu, replace: '$1больше$2'},
    {search: /([^\w]|^)under([^\w]|$)/giu, replace: '$1меньше$2'},
    {search: /([^\w]|^)draw([^\w]|$)/giu, replace: '$1ничья$2'},
    {search: /([^\w]|^)yes([^\w]|$)/giu, replace: '$1да$2'},
    {search: /([^\w]|^)none([^\w]|$)/giu, replace: '$1не будет$2'},
    {search: /([^\w]|^)exact([^\w]|$)/giu, replace: '$1точное$2'},
    {search: /([^\w]|^)goals?([^\w]|$)/giu, replace: '$1гол$2'},
    {search: /([^\w]|^)odd([^\w]|$)/giu, replace: '$1нечетный$2'},
    {search: /([^\w]|^)even([^\w]|$)/giu, replace: '$1четный$2'},
    {search: /([^\w]|^)corners?([^\w]|$)/giu, replace: '$1угловой$2'},
    {search: /([^\w]|^)&([^\w]|$)/giu, replace: '$1и$2'},
    {search: /([^\w]|^)minutes?([^\w]|$)/giu, replace: '$1минут$2'},
    {search: /([^\w]|^)teams?([^\w]|$)/giu, replace: '$1команда$2'},
    {search: /([^\w]|^)first([^\w]|$)/giu, replace: '$1первый$2'},
    {search: /([^\w]|^)last([^\w]|$)/giu, replace: '$1последний$2'},
    {search: /([^\w]|^)sets?([^\w]|$)/giu, replace: '$1сет$2'},
    {search: /([^\w]|^)halfs?([^\w]|$)/giu, replace: '$1тайм$2'},
    {search: /([^\w]|^)consigns?([^\w]|$)/giu, replace: '$1партия$2'},
    {search: /([^\w]|^)periods?([^\w]|$)/giu, replace: '$1период$2'},
    {search: /([^\w]|^)quarters?([^\w]|$)/giu, replace: '$1четверт$2'},
    {search: /([^\w]|^)maps?([^\w]|$)/giu, replace: '$1карта$2'},
    {search: /([^\w]|^)games?([^\w]|$)/giu, replace: '$1гейм$2'},
    {search: /([^\w]|^)results?([^\w]|$)/giu, replace: '$1результат$2'},
    {search: /([^\w]|^)3-way([^\w]|$)/giu, replace: '$1трехпутевой$2'},
    {search: /([^\w]|^)points?([^\w]|$)/giu, replace: '$1очки$2'},
    {search: /([^\w]|^)match([^\w]|$)/giu, replace: '$1матч$2'},
    {search: /([^\w]|^)rounds?([^\w]|$)/giu, replace: '$1раунд$2'},
    {search: /([^\w]|^)(scored|score)([^\w]|$)/giu, replace: '$1счет$3'},
    {search: /([^\w]|^)penalty([^\w]|$)/giu, replace: '$1пенальти$2'},
    {search: /([^\w]|^)alternative([^\w]|$)/giu, replace: '$1альтернативный$2'},
    {search: /([^\w]|^)next([^\w]|$)/giu, replace: '$1следующий$2'},
    {search: /([^\w]|^)current([^\w]|$)/giu, replace: '$1текущий$2'},
    {search: /([^\w]|^)second([^\w]|$)/giu, replace: '$1второй$2'},
    {search: /([^\w]|^)two([^\w]|$)/giu, replace: '$1два$2'},
    {search: /([^\w]|^)either([^\w]|$)/giu, replace: '$1в одном из$2'},
    {search: /([^\w]|^)winner([^\w]|$)/giu, replace: '$1победитель$2'},
    {search: /([^\w]|^)both([^\w]|$)/giu, replace: '$1обе$2'},
    {search: /([^\w]|^)interval([^\w]|$)/giu, replace: '$1интервал$2'},
    {search: /([^\w]|^)exactly([^\w]|$)/giu, replace: '$1точно$2'},
    {search: /([^\w]|^)most([^\w]|$)/giu, replace: '$1больше$2'},
    {search: /([^\w]|^)min([^\w]|$)/giu, replace: '$1минуты$2'},
    {search: /([^\w]|^)(incl.?|include)([^\w]|$)/giu, replace: '$1включая$3'},
    {search: /([^\w]|^)and([^\w]|$)/giu, replace: '$1и$2'},
    {search: /([^\w]|^)penalties?([^\w]|$)/giu, replace: '$1пенальти$2'},
    {search: /([^\w]|^)time([^\w]|$)/giu, replace: '$1время$2'},
    {search: /([^\w]|^)other([^\w]|$)/giu, replace: '$1любой другой$2'},
    {search: /([^\w]|^)no([^\w]|$)/giu, replace: '$1нет$2'},
    {search: /([^\w]|^)in([^\w]|$)/giu, replace: '$1в$2'},
    {search: /([^\w]|^)or([^\w]|$)/giu, replace: '$1или$2'},
    {search: /([^\w]|^)any([^\w]|$)/giu, replace: '$1любой$2'},
    {search: /([^\w]|^)nil([^\w]|$)/giu, replace: '$1пустой$2'},
    {search: /([^\w]|^)double([^\w]|$)/giu, replace: '$1двойной$2'},
  ];

  constructor() { }

  public translate(betString: string, language: string): string {
    if (language === 'en') {
      return this.en(betString);
    } else {
      return betString;
    }
  }

  private en(betString: string): string {
    for (let i = 0; i < this.enList.length; i ++) {
      betString = betString.replace(this.enList[i].search, this.enList[i].replace);
    }
    return betString;
  }

  public transliterate(word: string): string {
    const patterns = {'Ё': 'YO', 'Й': 'I', 'Ц': 'TS', 'У': 'U', 'К': 'K', 'Е': 'E', 'Н': 'N', 'Г': 'G', 'Ш': 'SH', 'Щ': 'SCH', 'З': 'Z', 'Х': 'H', 'Ъ': '\'', 'ё': 'yo', 'й': 'i', 'ц': 'ts', 'у': 'u', 'к': 'k', 'е': 'e', 'н': 'n', 'г': 'g', 'ш': 'sh', 'щ': 'sch', 'з': 'z', 'х': 'h', 'ъ': '\'', 'Ф': 'F', 'Ы': 'I', 'В': 'V', 'А': 'a', 'П': 'P', 'Р': 'R', 'О': 'O', 'Л': 'L', 'Д': 'D', 'Ж': 'ZH', 'Э': 'E', 'ф': 'f', 'ы': 'i', 'в': 'v', 'а': 'a', 'п': 'p', 'р': 'r', 'о': 'o', 'л': 'l', 'д': 'd', 'ж': 'zh', 'э': 'e', 'Я': 'Ya', 'Ч': 'CH', 'С': 'S', 'М': 'M', 'И': 'I', 'Т': 'T', 'Ь': '\'', 'Б': 'B', 'Ю': 'YU', 'я': 'ya', 'ч': 'ch', 'с': 's', 'м': 'm', 'и': 'i', 'т': 't', 'ь': '\'', 'б': 'b', 'ю': 'yu'};
    return word.split('').map(function (char) {
      return patterns[char] || char;
    }).join('');
  }
}
