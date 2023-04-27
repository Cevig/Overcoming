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
  Stun: "Приголомшення",
  InitiativeDown: "Зниження ініціативи",
  InitiativeDownAura: "Аура зниження ініціативи",
  InitiativeUpAura: "Аура збільшення ініціативи",
  HealsDownAura: "Аура зниження життя",
  PowerDown: "Силу знижено",
  PowerUp: "Силу збільшено",
  PowerUpCharge: "Силу збільшено на удар",
  PowerUpSupport: "Підтримка",
  Poison: "Отруєння",
  Unfocused: "Розгубленість",
  Vengeance: "Помста",
  VengeanceTarget: "Ціль для мстивих",
  Unarmed: "Від'ємно озброєний",
  Fired: "Згорілий",
})

export const NegativeStatues = [UnitStatus.Freeze, UnitStatus.Stun, UnitStatus.InitiativeDown, UnitStatus.InitiativeDownAura, UnitStatus.HealsDownAura, UnitStatus.PowerDown, UnitStatus.Poison, UnitStatus.Unfocused, UnitStatus.Vengeance, UnitStatus.Unarmed, UnitStatus.Fired]

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
  AbsoluteMove: "Неприборкана Швидкість",
  AlwaysCounterDamage: "Нескінченна відповідь",
  FullDeathDamage: "Повна відповідь",
  RestrictedRoundDamage: "Обмежена Конусна атака",
})

export const UnitSkills = Object.freeze({
  Surround3: "Оточити до смерті",
  Wholeness: "Цілісність",
  BlockStatuses: "Нівелювання негативу",
  AddFreezeEffect: "Атака зупиняє",
  AddUnfocusedEffect: "Атака розгублює",
  AddPoisonEffect: "Атака отруює",
  AddPoisonEffectOnRaid: "Рейд отруює",
  AddStunEffect: "Атака приголомшує",
  AddVengeanceEffect: "Атака примушує помститися",
  MaraAura: "Аура зниження ініціативи",
  LowHealsAura: "Аура зниження життя",
  HalaAura: "Аура нівелювання рейду",
  ObajifoAura: "Аура підвищення ініціативи",
  UnfocusedAura: "Аура розгубленості",
  Raid: "Рейд",
  LethalGrab: "Вбирання останків",
  LethalBlow: "Вибух Жаху",
  Urka: "Ирка можливості",
  InstantKill: "Миттєва смерть",
  InstantKillOnCounter: "Смертельна відповідь",
  Lesavka: "Атака притягує",
  ThrowOver: "Атака перекидує",
  UtilizeDeath: "Каталізатор смерті",
  healAlly: "Відновити життя",
  abasuCurse: "Прокляття Абаси",
  chainDamage: "Урон по ланцюжку",
  throwWeapon: "Шпурнути ікла",
  replaceUnits: "Поміняти місцями",
  pauseToRecover: "Час відновитись",
  NotMovedRecover: "Відновитись",
  RaidBlock: "Рейд вже не той",
  AntiVestnick: `Опір до ${UnitTypes.Vestnick}`,
  ReduceDamage: `Товстошкірий`,
  HealOnAttack: `Відновлення при атаці`,
  DeadlyDamage: "Смертельний урон",
  DoubleDamage: "Подвійний урон",
  DoubleDamageInDefence: "Подвійний урон через повільність",
  RoundDamage: "Конусна атака",
  ThroughDamage: "Пронизуюча атака",
  BlockDamage: "Заблокувати урон",
  InjuredDamage: "Вибух адреналіну",
  DecreaseInitiative: "Атака знижує ініціативу",
  ChargeAttack: "Зарядити атаку",
  RemoveChargeAttack: "Повернути показники сили",
  SetElokoCurse: "Зачарувати істоту",
  SetItOnFire: "Вижигаюче полум'я",
  ReturnDamage: "Повернути урон"
})
