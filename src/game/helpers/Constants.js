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
  Idol: "idol",
  Prispeshnick: "prispeshnick",
  Prominkor: "prominkor",
  Vestnick: "vestnick"
})

export const Biom = Object.freeze({
  Steppe: "steppe",
  Forest: "forest",
  Mountains: "mountains",
  Desert: "desert",
  Tundra: "tundra",
  Jungle: "jungle",
  Water: "water",
  Mash: "mash",
  Geysers: "geysers"
})


export const DamageType = Object.freeze({
  Default: "default",
  Counter: "counter",
  Raid: "raid",
  ReplaceHeals: "replaceHeals",
  Heal: "heal",
  Poison: "poison",
  Chained: "chained",
})
export const DamageTypes = [DamageType.Default, DamageType.Counter, DamageType.Raid, DamageType.Chained]

export const UnitStatus = Object.freeze({
  Freeze: "freeze",
  Stun: "stun",
  InitiativeDown: "initiativeDown",
  InitiativeDownAura: "initiativeDownAura",
  InitiativeUpAura: "initiativeUpAura",
  HealsDownAura: "healsDownAura",
  PowerDown: "powerDown",
  PowerUp: "powerUp",
  PowerUpCharge: "powerUpCharge",
  PowerUpSupport: "powerUpSupport",
  Poison: "poison",
  Unfocused: "unfocused",
  Vengeance: "vengeance",
  VengeanceTarget: "vengeanceTarget",
  Unarmed: "unarmed",
  Fired: "fired",
  Cursed: "cursed",
})

export const NegativeStatues = [UnitStatus.Freeze, UnitStatus.Stun, UnitStatus.InitiativeDown, UnitStatus.InitiativeDownAura, UnitStatus.HealsDownAura, UnitStatus.PowerDown, UnitStatus.Poison, UnitStatus.Unfocused, UnitStatus.Vengeance, UnitStatus.Unarmed, UnitStatus.Fired, UnitStatus.Cursed]

export const UnitKeywords = Object.freeze({
  Sneaky: "sneaky",
  Unfocused: "unfocused",
  MainTarget: "mainTarget",
  Support: "support",
  RestrictedRaid: "restrictedRaid",
  AbsoluteRaid: "absoluteRaid",
  NoObstaclesRaid: "noObstaclesRaid",
  ReplaceHealsRaid: "replaceHealsRaid",
  AdditionalSacrificeRaid: "additionalSacrificeRaid",
  ExtendedMove: "extendedMove",
  AbsoluteMove: "absoluteMove",
  AlwaysCounterDamage: "alwaysCounterDamage",
  FullDeathDamage: "fullDeathDamage",
  RestrictedRoundDamage: "restrictedRoundDamage",
  LowCost: "lowCost",
  AdditionalEssence: "additionalEssence",
})

export const UnitSkills = Object.freeze({
  Surround3: "surround3",
  Wholeness: "wholeness",
  BlockStatuses: "blockStatuses",
  AddFreezeEffect: "addFreezeEffect",
  AddUnfocusedEffect: "addUnfocusedEffect",
  AddPoisonEffect: "addPoisonEffect",
  AddPoisonEffectOnRaid: "addPoisonEffectOnRaid",
  AddStunEffect: "addStunEffect",
  AddVengeanceEffect: "addVengeanceEffect",
  MaraAura: "maraAura",
  LowHealsAura: "lowHealsAura",
  HalaAura: "halaAura",
  ObajifoAura: "obajifoAura",
  UnfocusedAura: "unfocusedAura",
  Raid: "raid",
  LethalGrab: "lethalGrab",
  LethalBlow: "lethalBlow",
  Urka: "urka",
  InstantKill: "instantKill",
  InstantKillOnCounter: "instantKillOnCounter",
  Lesavka: "lesavka",
  ThrowOver: "throwOver",
  UtilizeDeath: "utilizeDeath",
  HealAlly: "healAlly",
  AbasuCurse: "abasuCurse",
  ChainDamage: "chainDamage",
  ThrowWeapon: "throwWeapon",
  ReplaceUnits: "replaceUnits",
  PauseToRecover: "pauseToRecover",
  NotMovedRecover: "notMovedRecover",
  RaidBlock: "raidBlock",
  AntiVestnick: "antiVestnick",
  ReduceDamage: "reduceDamage",
  HealOnAttack: "healOnAttack",
  DeadlyDamage: "deadlyDamage",
  DoubleDamage: "doubleDamage",
  DoubleDamageInDefence: "doubleDamageInDefence",
  RoundDamage: "roundDamage",
  ThroughDamage: "throughDamage",
  BlockDamage: "blockDamage",
  InjuredDamage: "injuredDamage",
  DecreaseInitiative: "decreaseInitiative",
  ChargeAttack: "chargeAttack",
  RemoveChargeAttack: "removeChargeAttack",
  SetElokoCurse: "setElokoCurse",
  SetItOnFire: "setItOnFire",
  ReturnDamage: "returnDamage"
});

export const BuildingsType = Object.freeze({
  Peace: "peace",
  Vivtar1: "vivtar1",
  Vivtar2: "vivtar2",
  Vivtar3: "vivtar3",
})
export const Buildings = Object.freeze({
  Kapitoliy: {
    name: "kapitoliy",
    price: 0,
    type: BuildingsType.Peace
  },
  Zmicnenja: {
    name: "zmicnenja",
    price: 4,
    type: BuildingsType.Peace
  },
  NebesnaBrama: {
    name: "nebesnaBrama",
    price: 5,
    type: BuildingsType.Peace
  },
  Veja: {
    name: "veja",
    price: 5,
    type: BuildingsType.Peace
  },
  Pamjatnuk: {
    name: "pamjatnuk",
    price: 7,
    type: BuildingsType.Peace
  },
  Svjatulushe: {
    name: "svjatulushe",
    price: 0,
    type: BuildingsType.Peace
  },
  VivtarPoplichnukiv: {
    name: `vivtarPoplichnukiv`,
    price: 4,
    type: BuildingsType.Vivtar1
  },
  VivtarPoplichnukiv2: {
    name: `vivtarPoplichnukiv2`,
    price: 5,
    type: BuildingsType.Vivtar1
  },
  VivtarPoplichnukiv3: {
    name: `vivtarPoplichnukiv3`,
    price: 6,
    type: BuildingsType.Vivtar1
  },
  VivtarProminkoriv: {
    name: `vivtarProminkoriv`,
    price: 4,
    type: BuildingsType.Vivtar2
  },
  VivtarProminkoriv2: {
    name: `vivtarProminkoriv2`,
    price: 5,
    type: BuildingsType.Vivtar2
  },
  VivtarProminkoriv3: {
    name: `vivtarProminkoriv3`,
    price: 6,
    type: BuildingsType.Vivtar2
  },
  VivtarVisnukiv: {
    name: `vivtarVisnukiv`,
    price: 4,
    type: BuildingsType.Vivtar3
  },
  VivtarVisnukiv2: {
    name: `vivtarVisnukiv2`,
    price: 5,
    type: BuildingsType.Vivtar3
  },
  VivtarVisnukiv3: {
    name: `vivtarVisnukiv3`,
    price: 6,
    type: BuildingsType.Vivtar3
  }
})

export const SortieTypes = Object.freeze({
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  X: `X`,
  Y: `Y`
})
