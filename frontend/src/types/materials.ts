export interface MaterialItem {
  german: string;
  english: string;
}

export const GEBAEUDE_MATERIALS: Record<string, MaterialItem> = {
  muell_groß: { german: 'Müllbeutel Groß (120 L)', english: 'Trash Bags Large (120 L)' },
  muell_med: { german: 'Müllbeutel Medium (60 L)', english: 'Trash Bags Medium (60 L)' },
  muell_klein: { german: 'Müllbeutel Klein (28 L)', english: 'Trash Bags Small (28 L)' },
  mopp_mikro: { german: 'Wischmopp Mikrofaser (50 cm)', english: 'Microfiber Mop (50 cm)' },
  mopp_baum: { german: 'Wischmopp Baumwolle (50 cm)', english: 'Cotton Mop (50 cm)' },
  lappen_rot: { german: 'Mikrofaser Lappen rot (40x40 cm)', english: 'Red Microfiber Cloth (40x40 cm)' },
  lappen_blau: { german: 'Mikrofaser Lappen blau (40x40 cm)', english: 'Blue Microfiber Cloth (40x40 cm)' },
  lappen_gruen: { german: 'Mikrofaser Lappen grün (40x40 cm)', english: 'Green Microfiber Cloth (40x40 cm)' },
  lappen_gelb: { german: 'Mikrofaser Lappen gelb (40x40 cm)', english: 'Yellow Microfiber Cloth (40x40 cm)' },
  geschirr: { german: 'Geschirrtücher (70x50 cm)', english: 'Kitchen / Dish Towels (70x50 cm)' },
  sanitaer: { german: 'Sanitärreiniger Milizid / Sprühflasche', english: 'Bathroom Cleaner Spray' },
  boden: { german: 'Bodenreiniger Torrun Konzentrat', english: 'Floor Cleaner Concentrate' },
  oberflaeche: { german: 'Oberflächenreiniger', english: 'Surface Cleaner' },
  wc_papier: { german: 'Toilettenpapier', english: 'Toilet Paper' },
  handtuch: { german: 'Falthandtücher', english: 'Folded Hand Towels' },
  seife: { german: 'Handseife (10 Liter)', english: 'Hand Soap (10 Liters)' },
  sonstiges: { german: 'Sonstiges', english: 'Miscellaneous / Other' }
};

export const WASCHSALON_MATERIALS: Record<string, MaterialItem> = {
  haende_folien: { german: 'Handfolien / Einweghandschuhe', english: 'Plastic Gloves / Hand Films' },
  buegelstaerke: { german: 'Bügelstärke', english: 'Ironing Starch / Spray Starch' },
  chlor: { german: 'Chlor', english: 'Chlorine / Bleach' },
  waschpulver: { german: 'Waschpulver (20 kg)', english: 'Washing Powder (20 kg)' },
  weichspueler: { german: 'Weichspüler (20 Liter)', english: 'Fabric Softener (20 Liters)' },
  sonstiges: { german: 'Sonstiges', english: 'Miscellaneous / Other' }
};
