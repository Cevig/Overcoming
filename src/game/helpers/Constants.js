export const playerColors = [
  '#e72828',
  '#3867f9',
  '#2ecb00',
  '#ffc107'
];

export const UnitTypes = Object.freeze({
  Idol: "Ідол",
  Prispeshnick: "Поплічник",
  Ispolin: "Промінькор",
  Vestnick: "Вісник"
})

export const Biom = Object.freeze({
  Steppe: "Степ",
  Forest: "Ліс",
  Mountains: "Гори",
  Desert: "Пустеля",
  Tundra: "Тундра",
  Jungle: "Джунглі",
  Water: "Водоєм",
  Mash: "Болота",
  Geysers: "Гейзери"
})


export const DamageType = Object.freeze({
  Default: "Звичайний",
  Counter: "Відповідь",
  Raid: "Рейд",
  ReplaceHeals: "Перелив життя",
  Heal: "Лікування",
  Poison: "Отруєння",
  Chained: "Ланцюжок",
})

export const DamageTypes = [DamageType.Default, DamageType.Counter, DamageType.Raid, DamageType.Chained]
export const UnitStatus = Object.freeze({
  Freeze: "Нерухомість",
  InitiativeDown: "Зниження ініціативи",
  InitiativeDownAura: "Аура зниження ініціативи",
  InitiativeUpAura: "Аура збільшення ініціативи",
  PowerDown: "Силу знижено",
  PowerUp: "Силу збільшено",
  PowerUpSupport: "Підтримка",
  Curse: "Прокляття",
  Poison: "Отруєння",
  Unfocused: "Розгубленість",
  Vengeance: "Помста",
  Unarmed: "Від'ємно озброєний",
})

export const UnitKeywords = Object.freeze({
  Sneaky: "Спритність",
  Unfocused: "Розгубленість",
  MainTarget: "Головна Ціль",
  Support: "Підтримка",
  RestrictedRaid: "Обмежений Рейд",
  AbsoluteRaid: "Рейд Без Обмежень",
  NoObstaclesRaid: "Рейд скрізь союзників",
  ReplaceHealsRaid: "Рейд з переливом життя",
  AdditionalSacrificeRaid: "Посилений Жертовний Рейд",
  ExtendedMove: "Швидкість",
  VengeanceTarget: "Ціль для мстивих",
  AlwaysCounterDamage: "Нескінченна відповідь",
  FullDeathDamage: "Повна відповідь"
})

export const UnitSkills = Object.freeze({
  Surround3: "Оточити до смерті",
  Wholeness: "Цілісність",
  AddFreezeEffect: "Атака зупиняє",
  AddUnfocusedEffect: "Атака розгублює",
  AddPoisonEffect: "Атака отруює",
  AddVengeanceEffect: "Атака примушує помститися",
  MaraAura: "Аура зниження ініціативи",
  HalaAura: "Аура нівелювання рейду",
  ObajifoAura: "Аура підвищення ініціативи",
  Raid: "Рейд",
  LethalGrab: "Вбирання останків",
  Urka: "Ырка можливості",
  InstantKill: "Миттєва смерть",
  Lesavka: "Атака притягує",
  UtilizeDeath: "Каталізатор смерті",
  healAlly: "Відновити життя",
  abasuCurse: "Прокляття Абаси",
  chainDamage: "Урон по ланцюжку",
  throwWeapon: "Шпурнути ікла",
  replaceUnits: "Поміняти місцями",
  pauseToRecover: "Час відновитись",
  RaidBlock: "Рейд вже не той",
  AntiVestnick: `Опір до ${UnitTypes.Vestnick}`,
  HealOnAttack: `Відновлення при атаці`,
  DeadlyDamage: "Смертельний урон",
  DoubleDamage: "Подвійний урон",
  RoundDamage: "Конусна атака",
})
