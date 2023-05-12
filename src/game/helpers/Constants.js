export const playerColors = [
  '#e72828',
  '#3867f9',
  '#2ecb00',
  '#ffc107'
];

export const createPoint = (...pos) => {
  const [x, y, z] = pos;
  return {x, y, z, coord: `${x},${y},${z}`};
}
export const essencePoints = (allPlayersNum) => {
  if (allPlayersNum === 3) {
    return [createPoint(0, 0, 0), createPoint(-1, 0, 1), createPoint(0, -1, 1)]
  } else if (allPlayersNum === 2) {
    return [createPoint(0, 0, 0), createPoint(0, 1, -1), createPoint(0, -1, 1)]
  } else {
    return [createPoint(0, 0, 0), createPoint(-1, 0, 1), createPoint(0, -1, 1), createPoint(1, -1, 0)]
  }
}

export const UnitTypes = Object.freeze({
  Idol: "Ідол",
  Prispeshnick: "Поплічник",
  Prominkor: "Промінькор",
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
  Cursed: "Проклятий",
})

export const NegativeStatues = [UnitStatus.Freeze, UnitStatus.Stun, UnitStatus.InitiativeDown, UnitStatus.InitiativeDownAura, UnitStatus.HealsDownAura, UnitStatus.PowerDown, UnitStatus.Poison, UnitStatus.Unfocused, UnitStatus.Vengeance, UnitStatus.Unarmed, UnitStatus.Fired, UnitStatus.Cursed]

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
  LowCost: "Знижка на виклик",
  AdditionalEssence: "Додадткова нагорода",
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
  HealOnAttack: `Вампіризм`,
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

export const BuildingsType = Object.freeze({
  Peace: "Мирні Споруди",
  Vivtar1: "Вівтари Поплічників",
  Vivtar2: "Вівтари Промінькорів",
  Vivtar3: "Вівтари Вісників",
})
export const Buildings = Object.freeze({
  Kapitoliy: {
    name: "Капітолій",
    description: "Головний об'єкт гравця. Має 10 життя на старті. Гравець вибуває з гри якщо Капітолій буде зруйнован",
    price: 0,
    type: BuildingsType.Peace
  },
  Zmicnenja: {
    name: "Зміцнення",
    description: "Віднімає 2 життя у кожної істоти після атаки на Ваш Капітолій",
    price: 4,
    type: BuildingsType.Peace
  },
  NebesnaBrama: {
    name: "Небесна брама",
    description: "Підвищує дохід з вилазок - +3 ✾ за кожну істоту у вилазці",
    price: 5,
    type: BuildingsType.Peace
  },
  Veja: {
    name: "Вежа",
    description: "Подвоює урон по Капітолію ворога",
    price: 5,
    type: BuildingsType.Peace
  },
  Pamjatnuk: {
    name: "Пам'ятник",
    description: "Блокує ворожі вилазки. Противник не отримує ніякого доходу при вилазці",
    price: 7,
    type: BuildingsType.Peace
  },
  Svjatulushe: {
    name: "Святилище",
    description: "Приносить 8✾ на початку раунда",
    price: 0,
    type: BuildingsType.Peace
  },
  VivtarPoplichnukiv: {
    name: `Вівтар "${UnitTypes.Prispeshnick}" &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prispeshnick} першого рівня`,
    price: 4,
    type: BuildingsType.Vivtar1
  },
  VivtarPoplichnukiv2: {
    name: `Вівтар "${UnitTypes.Prispeshnick}" &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prispeshnick} другого рівня`,
    price: 7,
    type: BuildingsType.Vivtar1
  },
  VivtarPoplichnukiv3: {
    name: `Вівтар "${UnitTypes.Prispeshnick}" &#9733; &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prispeshnick} третього рівня`,
    price: 10,
    type: BuildingsType.Vivtar1
  },
  VivtarProminkoriv: {
    name: `Вівтар "${UnitTypes.Prominkor}" &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prominkor} першого рівня`,
    price: 4,
    type: BuildingsType.Vivtar2
  },
  VivtarProminkoriv2: {
    name: `Вівтар "${UnitTypes.Prominkor}" &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prominkor} другого рівня`,
    price: 7,
    type: BuildingsType.Vivtar2
  },
  VivtarProminkoriv3: {
    name: `Вівтар "${UnitTypes.Prominkor}" &#9733; &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Prominkor} третього рівня`,
    price: 10,
    type: BuildingsType.Vivtar2
  },
  VivtarVisnukiv: {
    name: `Вівтар "${UnitTypes.Vestnick}" &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Vestnick} першого рівня`,
    price: 4,
    type: BuildingsType.Vivtar3
  },
  VivtarVisnukiv2: {
    name: `Вівтар "${UnitTypes.Vestnick}" &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Vestnick} другого рівня`,
    price: 7,
    type: BuildingsType.Vivtar3
  },
  VivtarVisnukiv3: {
    name: `Вівтар "${UnitTypes.Vestnick}" &#9733; &#9733; &#9733;`,
    description: `Дозволяє призивати істот типу ${UnitTypes.Vestnick} третього рівня`,
    price: 10,
    type: BuildingsType.Vivtar3
  }
})

export const SortieTypes = Object.freeze({
  A: "Неперевершена перевага - +7✾ +5✾ від потерпілого",
  B: "Чисельне придушення - +7✾",
  C: "Сили рівні - +0✾",
  D: "Чисельна меншість - -0✾",
  E: "Повний розгром - -5✾",
  X: `Ворожа вилазка не має ефекту через ${Buildings.Pamjatnuk.name} - +0✾`,
  Y: `Вилазка була невдалою через ${Buildings.Pamjatnuk.name} - +0✾`
})
