import {Biom} from "./Constants";

export const biomComparison = (biom1, biom2) => [
  { bioms: [Biom.Steppe, Biom.Forest], result: Biom.Forest },
  { bioms: [Biom.Steppe, Biom.Mountains], result: Biom.Mountains },
  { bioms: [Biom.Steppe, Biom.Desert], result: Biom.Steppe },
  { bioms: [Biom.Steppe, Biom.Tundra], result: Biom.Steppe },
  { bioms: [Biom.Steppe, Biom.Jungle], result: Biom.Jungle },
  { bioms: [Biom.Steppe, Biom.Water], result: Biom.Steppe },
  { bioms: [Biom.Steppe, Biom.Mash], result: Biom.Mash },
  { bioms: [Biom.Steppe, Biom.Geysers], result: Biom.Steppe },

  { bioms: [Biom.Forest, Biom.Mountains], result: Biom.Mountains },
  { bioms: [Biom.Forest, Biom.Desert], result: Biom.Desert },
  { bioms: [Biom.Forest, Biom.Tundra], result: Biom.Forest },
  { bioms: [Biom.Forest, Biom.Jungle], result: Biom.Jungle },
  { bioms: [Biom.Forest, Biom.Water], result: Biom.Forest },
  { bioms: [Biom.Forest, Biom.Mash], result: Biom.Forest },
  { bioms: [Biom.Forest, Biom.Geysers], result: Biom.Geysers },

  { bioms: [Biom.Mountains, Biom.Desert], result: Biom.Mountains },
  { bioms: [Biom.Mountains, Biom.Tundra], result: Biom.Tundra },
  { bioms: [Biom.Mountains, Biom.Jungle], result: Biom.Jungle },
  { bioms: [Biom.Mountains, Biom.Water], result: Biom.Water },
  { bioms: [Biom.Mountains, Biom.Mash], result: Biom.Mash },
  { bioms: [Biom.Mountains, Biom.Geysers], result: Biom.Mountains },

  { bioms: [Biom.Desert, Biom.Tundra], result: Biom.Desert },
  { bioms: [Biom.Desert, Biom.Jungle], result: Biom.Desert },
  { bioms: [Biom.Desert, Biom.Water], result: Biom.Water },
  { bioms: [Biom.Desert, Biom.Mash], result: Biom.Desert },
  { bioms: [Biom.Desert, Biom.Geysers], result: Biom.Geysers },

  { bioms: [Biom.Tundra, Biom.Jungle], result: Biom.Tundra },
  { bioms: [Biom.Tundra, Biom.Water], result: Biom.Tundra },
  { bioms: [Biom.Tundra, Biom.Mash], result: Biom.Mash },
  { bioms: [Biom.Tundra, Biom.Geysers], result: Biom.Tundra },

  { bioms: [Biom.Jungle, Biom.Water], result: Biom.Jungle },
  { bioms: [Biom.Jungle, Biom.Mash], result: Biom.Mash },
  { bioms: [Biom.Jungle, Biom.Geysers], result: Biom.Geysers },

  { bioms: [Biom.Water, Biom.Mash], result: Biom.Water },
  { bioms: [Biom.Water, Biom.Geysers], result: Biom.Water },

  { bioms: [Biom.Mash, Biom.Geysers], result: Biom.Geysers },
].find(row => [biom1, biom2].every(biom => row.bioms.includes(biom))).result === biom1 ? 1 : -1
