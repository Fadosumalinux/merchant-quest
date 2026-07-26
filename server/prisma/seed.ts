import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data via raw SQL (avoids Prisma model name casing issues)
  const tables = ["UserAchievement", "Review", "Token", "Trade", "Inventory", "Waypoint", "NPC", "Achievement", "Avatar", "Item", "Zone", "User"];
  for (const t of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${t}"`);
  }

  // === ZONES ===
  const zonesData = [
    { id: "zone-village", name: "Village Market", description: "El mercado principal donde todos los comerciantes principiantes dan sus primeros pasos.", culture: "universal", requiredLevel: 1, mapX: 200, mapY: 300, width: 280, height: 220, bgGradient: "linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%)" },
    { id: "zone-gypsy", name: "Romani Caravan", description: "La caravana gitana viaja entre pueblos. Aquí se negocia con cantos, bailes y la astucia del camino.", culture: "gypsy", requiredLevel: 3, mapX: 550, mapY: 180, width: 260, height: 200, bgGradient: "linear-gradient(135deg, #8b2252 0%, #c44569 100%)" },
    { id: "zone-chinese", name: "Dragon Bazaar", description: "El mercado del dragón. Sedas, porcelana y los secretos mejor guardados del comercio oriental.", culture: "chinese", requiredLevel: 5, mapX: 900, mapY: 120, width: 300, height: 240, bgGradient: "linear-gradient(135deg, #8b0000 0%, #cc3300 100%)" },
    { id: "zone-moroccan", name: "Medina de Fez", description: "Los zocos marroquíes desbordan color, especias y artesanía. Negocia con paciencia y el té nunca falta.", culture: "moroccan", requiredLevel: 8, mapX: 1280, mapY: 350, width: 280, height: 220, bgGradient: "linear-gradient(135deg, #c2720d 0%, #e8a838 100%)" },
    { id: "zone-wallstreet", name: "Wall Street Tower", description: "La torre de los high-rollers. Contratos, derivados y la adrenalina del mercado.", culture: "wallstreet", requiredLevel: 12, mapX: 550, mapY: 520, width: 300, height: 240, bgGradient: "linear-gradient(135deg, #1a1a4e 0%, #2d2d7a 100%)" },
    { id: "zone-pirate", name: "Pirate Cove", description: "La bahía de los piratas. Mercancía robada, mapas del tesoro y rum.", culture: "fantasy", requiredLevel: 15, mapX: 1650, mapY: 200, width: 260, height: 200, bgGradient: "linear-gradient(135deg, #2c1654 0%, #5c3a6b 100%)" },
    { id: "zone-royal", name: "Royal Capital", description: "La capital real. Comercio de lujo, joyas de la corona y los tratos más exclusivos.", culture: "universal", requiredLevel: 20, mapX: 900, mapY: 650, width: 300, height: 240, bgGradient: "linear-gradient(135deg, #8c6b3a 0%, #c4973a 100%)" },
    { id: "zone-sky", name: "Sky Islands", description: "Las islas flotantes del comercio celestial. Solo los maestros pueden llegar aquí.", culture: "fantasy", requiredLevel: 30, mapX: 1400, mapY: 600, width: 280, height: 220, bgGradient: "linear-gradient(135deg, #6b8c9a 0%, #a0d2db 100%)" },
  ];

  for (const z of zonesData) {
    await prisma.zone.create({ data: z });
  }
  console.log("  ✓ 8 zones");

  // === ITEMS ===
  const itemsData = [
    { id: "item-wheat", name: "Trigo", description: "El alimento básico. Siempre tiene demanda.", category: "food", rarity: "common", basePrice: 5, emoji: "🌾", culture: "universal" },
    { id: "item-water", name: "Agua Pura", description: "Líquido vital para todo comerciante.", category: "food", rarity: "common", basePrice: 3, emoji: "💧", culture: "universal" },
    { id: "item-wood", name: "Madera", description: "Material de construcción básico.", category: "artifacts", rarity: "common", basePrice: 8, emoji: "🪵", culture: "universal" },
    { id: "item-horseshoe", name: "Herradura de la Suerte", description: "Dice la gitana que trae fortuna.", category: "jewelry", rarity: "uncommon", basePrice: 25, emoji: "🧲", culture: "gypsy" },
    { id: "item-crystal", name: "Cristal Adivino", description: "Una bola de cristal que revela tendencias del mercado.", category: "artifacts", rarity: "rare", basePrice: 80, emoji: "🔮", culture: "gypsy" },
    { id: "item-tambourine", name: "Pandereta Mágica", description: "Su ritmo atrae clientes de todas las tierras.", category: "instruments", rarity: "uncommon", basePrice: 30, emoji: "🪘", culture: "gypsy" },
    { id: "item-horse", name: "Caballo Gitano", description: "Un corcel fiel que viaja sin descanso entre ferias.", category: "animals", rarity: "rare", basePrice: 120, emoji: "🐴", culture: "gypsy" },
    { id: "item-cloak", name: "Capa del Camino", description: "Protege del sol y la lluvia en las rutas comerciales.", category: "textiles", rarity: "common", basePrice: 15, emoji: "🧥", culture: "gypsy" },
    { id: "item-earring", name: "Pendientes de Plata", description: "Joyas que cuentan historias de generación en generación.", category: "jewelry", rarity: "uncommon", basePrice: 40, emoji: "✨", culture: "gypsy" },
    { id: "item-silk", name: "Seda Imperial", description: "La seda más fina del Imperio. Cada hilo es una obra de arte.", category: "textiles", rarity: "rare", basePrice: 90, emoji: "🧣", culture: "chinese" },
    { id: "item-porcelain", name: "Porcelana Ming", description: "Pieza de colección que vale una fortuna en Occidente.", category: "artifacts", rarity: "epic", basePrice: 200, emoji: "🏺", culture: "chinese" },
    { id: "item-tea", name: "Té Dragón Negro", description: "El té más raro. Su sabor despierta la mente del comerciante.", category: "food", rarity: "uncommon", basePrice: 35, emoji: "🍵", culture: "chinese" },
    { id: "item-fan", name: "Abanico de Guerra", description: "Un abanico que esconde filo. Belleza y peligro.", category: "weapons", rarity: "rare", basePrice: 70, emoji: "🪭", culture: "chinese" },
    { id: "item-jade", name: "Jade del Dragón", description: "Piedra sagrada que otorga sabiduría en los negocios.", category: "jewelry", rarity: "epic", basePrice: 180, emoji: "💎", culture: "chinese" },
    { id: "item-panda", name: "Oso Panda Bebé", description: "Una mascota exótica que nadie puede resistir.", category: "animals", rarity: "legendary", basePrice: 500, emoji: "🐼", culture: "chinese" },
    { id: "item-lantern", name: "Farol de la Fortuna", description: "Ilumina el camino hacia los mejores negocios.", category: "artifacts", rarity: "common", basePrice: 20, emoji: "🏮", culture: "chinese" },
    { id: "item-spice", name: "Especias del Sahara", description: "Canela, cúrcuma y azafrán. El oro rojo del desierto.", category: "food", rarity: "uncommon", basePrice: 30, emoji: "🌶️", culture: "moroccan" },
    { id: "item-carpet", name: "Tapiz de Fez", description: "Un tapiz tejido a mano durante meses. Cada nudo cuenta una historia.", category: "textiles", rarity: "rare", basePrice: 110, emoji: "🧶", culture: "moroccan" },
    { id: "item-lamp", name: "Lámpara de Aladdin", description: "Dicen que si la frotas... bueno, al menos ilumina.", category: "artifacts", rarity: "epic", basePrice: 160, emoji: "🪔", culture: "moroccan" },
    { id: "item-camel", name: "Camello del Desierto", description: "El mejor compañero para cruzar las dunas cargado de mercancía.", category: "animals", rarity: "rare", basePrice: 140, emoji: "🐫", culture: "moroccan" },
    { id: "item-hookah", name: "Narguile del Rey", description: "Un narguile tallado en oro. Los tratos se sellan entre bocanadas.", category: "artifacts", rarity: "uncommon", basePrice: 45, emoji: "🫧", culture: "moroccan" },
    { id: "item-dagger", name: "Daga Bereber", description: "Cuchilla ceremonial con incrustaciones de coral y plata.", category: "weapons", rarity: "rare", basePrice: 85, emoji: "🗡️", culture: "moroccan" },
    { id: "item-tagine", name: "Cous Cous Mágico", description: "Quien come de este plato, nunca pierde un negocio.", category: "food", rarity: "uncommon", basePrice: 25, emoji: "🥘", culture: "moroccan" },
    { id: "item-stock", name: "Acciones Apple", description: "Paquete de 100 acciones. El mercado sube, el mercado baja.", category: "artifacts", rarity: "uncommon", basePrice: 50, emoji: "📈", culture: "wallstreet" },
    { id: "item-bond", name: "Bonos del Tesoro", description: "Inversión segura para comerciantes conservadores.", category: "artifacts", rarity: "common", basePrice: 35, emoji: "🏛️", culture: "wallstreet" },
    { id: "item-briefcase", name: "Cartera de Cuero", description: "Contiene contratos millonarios y un café frío.", category: "textiles", rarity: "uncommon", basePrice: 40, emoji: "💼", culture: "wallstreet" },
    { id: "item-cufflinks", name: "Gemelos de Oro", description: "Los gemelos distinguen al verdadero magnate.", category: "jewelry", rarity: "rare", basePrice: 75, emoji: "👔", culture: "wallstreet" },
    { id: "item-limousine", name: "Limusina Negra", description: "Transporte ejecutivo. Llegar con estilo es parte del negocio.", category: "artifacts", rarity: "epic", basePrice: 250, emoji: "🚗", culture: "wallstreet" },
    { id: "item-cigar", name: "Puro Cubano", description: "Un puro que solo se fuma después de cerrar un millón.", category: "food", rarity: "common", basePrice: 15, emoji: "🚬", culture: "wallstreet" },
    { id: "item-monocle", name: "Monocle Financiero", description: "Para leer las letras finas de los contratos.", category: "jewelry", rarity: "uncommon", basePrice: 30, emoji: "🧐", culture: "wallstreet" },
    { id: "item-rum", name: "Ron del Pirata", description: "El mejor Ron de los siete mares. Calienta el alma.", category: "food", rarity: "common", basePrice: 12, emoji: "🍺", culture: "fantasy" },
    { id: "item-parrot", name: "Loro Parlanchín", description: "Repite los precios y espía a la competencia.", category: "animals", rarity: "uncommon", basePrice: 35, emoji: "🦜", culture: "fantasy" },
    { id: "item-map", name: "Mapa del Tesoro", description: "X marca el lugar... o no.", category: "artifacts", rarity: "rare", basePrice: 95, emoji: "🗺️", culture: "fantasy" },
    { id: "item-sword", name: "Espada del Capitán", description: "Acero que corta mercados y voluntades.", category: "weapons", rarity: "epic", basePrice: 180, emoji: "⚔️", culture: "fantasy" },
    { id: "item-compass", name: "Brújula Encantada", description: "Siempre apunta al negocio más rentable.", category: "artifacts", rarity: "rare", basePrice: 70, emoji: "🧭", culture: "fantasy" },
    { id: "item-cannon", name: "Cañón Portátil", description: "Para negociaciones que requieren énfasis.", category: "weapons", rarity: "epic", basePrice: 200, emoji: "💣", culture: "fantasy" },
  ];

  for (const item of itemsData) {
    await prisma.item.create({ data: item });
  }
  console.log("  ✓ 33 items");

  // === NPCs ===
  const npcsData = [
    { id: "npc-village-1", name: "Doña Mercadera", zoneId: "zone-village", role: "merchant", culture: "universal", personality: "friendly", avatarEmoji: "👵", dialog: "¡Bienvenido, joven! Aquí aprenderás los secretos del trueque.", tradeBonus: 5, teachesBadge: "ach-first-trade" },
    { id: "npc-village-2", name: "El Tío Banco", zoneId: "zone-village", role: "banker", culture: "universal", personality: "stern", avatarEmoji: "🧔", dialog: "Tu oro está seguro conmigo. Los intereses se calculan con precisión.", tradeBonus: 0 },
    { id: "npc-village-3", name: "Sabio Pueblo", zoneId: "zone-village", role: "sage", culture: "universal", personality: "wise", avatarEmoji: "🧙", dialog: "El comercio es un arte. Cada transacción es una lección.", tradeBonus: 0, teachesBadge: "ach-lesson-1" },
    { id: "npc-gypsy-1", name: "Flor de Lis", zoneId: "zone-gypsy", role: "merchant", culture: "gypsy", personality: "witty", avatarEmoji: "💃", dialog: "¡Ven! Mis cristales ven el futuro de tus inversiones.", tradeBonus: 10, teachesBadge: "ach-gypsy-initiation" },
    { id: "npc-gypsy-2", name: "Rey Romaní", zoneId: "zone-gypsy", role: "quest_giver", culture: "gypsy", personality: "mysterious", avatarEmoji: "👑", dialog: "El camino del comerciante gitano no es fácil.", tradeBonus: 15, teachesBadge: "ach-gypsy-master" },
    { id: "npc-gypsy-3", name: "Violinista Nocturno", zoneId: "zone-gypsy", role: "merchant", culture: "gypsy", personality: "friendly", avatarEmoji: "🎻", dialog: "Mi violín atrae clientes y mi instinto cierra negocios.", tradeBonus: 8 },
    { id: "npc-chinese-1", name: "Maestro Li Wei", zoneId: "zone-chinese", role: "merchant", culture: "chinese", personality: "wise", avatarEmoji: "👴", dialog: "El comercio es como el ajedrez: piensa tres movimientos adelante.", tradeBonus: 12, teachesBadge: "ach-chinese-wisdom" },
    { id: "npc-chinese-2", name: "Dragon Rojo", zoneId: "zone-chinese", role: "blacksmith", culture: "chinese", personality: "stern", avatarEmoji: "🐉", dialog: "Forjo acero que corta mercados.", tradeBonus: 8 },
    { id: "npc-chinese-3", name: "Concubina Luna", zoneId: "zone-chinese", role: "merchant", culture: "chinese", personality: "mysterious", avatarEmoji: "🌙", dialog: "La seda que vendo cuenta historias. Cada hilo tiene un secreto.", tradeBonus: 10, teachesBadge: "ach-silk-road" },
    { id: "npc-moroccan-1", name: "Hassan el Negociador", zoneId: "zone-moroccan", role: "merchant", culture: "moroccan", personality: "witty", avatarEmoji: "🕌", dialog: "¡Té, té! Pero primero, hablemos de negocios.", tradeBonus: 10, teachesBadge: "ach-moroccan-haggler" },
    { id: "npc-moroccan-2", name: "Amina del Zoco", zoneId: "zone-moroccan", role: "merchant", culture: "moroccan", personality: "friendly", avatarEmoji: "🧕", dialog: "Mis tapices son el orgullo de Fez.", tradeBonus: 12 },
    { id: "npc-moroccan-3", name: "Jeque Dorado", zoneId: "zone-moroccan", role: "banker", culture: "moroccan", personality: "stern", avatarEmoji: "👳", dialog: "El oro se respeta, el respeto se gana.", tradeBonus: 5, teachesBadge: "ach-golden-deal" },
    { id: "npc-wall-1", name: "Max Bullington III", zoneId: "zone-wallstreet", role: "merchant", culture: "wallstreet", personality: "stern", avatarEmoji: "📊", dialog: "Numbers don't lie. But I do. Just kidding.", tradeBonus: 15, teachesBadge: "ach-wall-street-101" },
    { id: "npc-wall-2", name: "Victoria Shortsell", zoneId: "zone-wallstreet", role: "quest_giver", culture: "wallstreet", personality: "witty", avatarEmoji: "📉", dialog: "Vendo en corto cuando otros compran.", tradeBonus: 20, teachesBadge: "ach-market-master" },
    { id: "npc-wall-3", name: "Chef Finance", zoneId: "zone-wallstreet", role: "merchant", culture: "wallstreet", personality: "friendly", avatarEmoji: "🧑‍🍳", dialog: "Cocino portfolios como platos.", tradeBonus: 10 },
    { id: "npc-pirate-1", name: "Capitán Barba Roja", zoneId: "zone-pirate", role: "merchant", culture: "fantasy", personality: "mysterious", avatarEmoji: "🏴‍☠️", dialog: "¡Arr! Compro y vendo todo lo que el mar trae.", tradeBonus: 12 },
    { id: "npc-pirate-2", name: "Sirena del Puerto", zoneId: "zone-pirate", role: "quest_giver", culture: "fantasy", personality: "witty", avatarEmoji: "🧜", dialog: "Los tesoros más valiosos están en los libros de contabilidad.", tradeBonus: 8, teachesBadge: "ach-pirate-legend" },
    { id: "npc-royal-1", name: "Duquesa de Oro", zoneId: "zone-royal", role: "merchant", culture: "universal", personality: "stern", avatarEmoji: "👸", dialog: "Solo negocio con quien tenga clase.", tradeBonus: 20, teachesBadge: "ach-royal-deal" },
    { id: "npc-royal-2", name: "El Consejero", zoneId: "zone-royal", role: "sage", culture: "universal", personality: "wise", avatarEmoji: "🎩", dialog: "He visto comerciantes subir y caer.", tradeBonus: 0, teachesBadge: "ach-lesson-master" },
    { id: "npc-sky-1", name: "Comerciante Celestial", zoneId: "zone-sky", role: "merchant", culture: "fantasy", personality: "mysterious", avatarEmoji: "☁️", dialog: "Aquí arriba, el comercio trasciende lo material.", tradeBonus: 25, teachesBadge: "ach-ascension" },
  ];

  for (const npc of npcsData) {
    await prisma.nPC.create({ data: npc });
  }
  console.log("  ✓ 20 NPCs");

  // === ACHIEVEMENTS ===
  const achievementsData = [
    { id: "ach-first-trade", name: "Primer Intercambio", description: "Completa tu primera transacción.", badgeEmoji: "🤝", badgeColor: "#cd7f32", category: "trading", tier: "bronze", xpReward: 50, goldReward: 25, requiredXp: 0, lessonText: "Todo gran comerciante empezó con un simple trueque. La confianza se construye交易交易交易.", quizQuestion: "¿Qué es lo más importante en tu primera transacción?", quizAnswer: "Confianza" },
    { id: "ach-10-trades", name: "Comerciante Activo", description: "Completa 10 transacciones exitosas.", badgeEmoji: "⭐", badgeColor: "#c0c0c0", category: "trading", tier: "silver", xpReward: 100, goldReward: 50, requiredXp: 0, lessonText: "La constancia es la madre del éxito.", quizQuestion: "¿Qué haces cuando un negocio no sale como esperabas?", quizAnswer: "Aprendo y sigo adelante" },
    { id: "ach-50-trades", name: "Magnate del Mercado", description: "Completa 50 transacciones sin reglas rotas.", badgeEmoji: "🏆", badgeColor: "#ffd700", category: "trading", tier: "gold", xpReward: 300, goldReward: 200, requiredXp: 0, lessonText: "Los verdaderos magnates no solo ganan dinero — ganan respeto.", quizQuestion: "¿Qué define a un verdadero magnate?", quizAnswer: "Respeto y ética" },
    { id: "ach-100-trades", name: "Leyenda Viva", description: "100 transacciones perfectas.", badgeEmoji: "👑", badgeColor: "#e5e4e2", category: "trading", tier: "platinum", xpReward: 500, goldReward: 500, requiredXp: 0, lessonText: "Tu nombre será recordado.", quizQuestion: "¿Qué legado deja un comerciante legendario?", quizAnswer: "Un ejemplo para otros" },
    { id: "ach-gypsy-initiation", name: "Iniciado Gitano", description: "Aprende los secretos del trueque gitano.", badgeEmoji: "💃", badgeColor: "#c44569", category: "exploration", tier: "bronze", xpReward: 75, goldReward: 30, requiredXp: 0, lessonText: "El comercio gitano se basa en la intuición y el encanto.", quizQuestion: "¿Qué vende realmente un comerciante gitano?", quizAnswer: "Experiencias e historias" },
    { id: "ach-chinese-wisdom", name: "Sabiduría del Dragón", description: "Domina el arte del comercio estratégico.", badgeEmoji: "🐉", badgeColor: "#cc0000", category: "exploration", tier: "silver", xpReward: 120, goldReward: 80, requiredXp: 0, lessonText: "La paciencia es poder.", quizQuestion: "¿Cuál es el arma secreta del comercio oriental?", quizAnswer: "Paciencia y estrategia" },
    { id: "ach-moroccan-haggler", name: "Maestro del Regateo", description: "Aprende el arte del regateo marroquí.", badgeEmoji: "🕌", badgeColor: "#e8a838", category: "exploration", tier: "silver", xpReward: 120, goldReward: 80, requiredXp: 0, lessonText: "El regateo es una danza. Ambas partes deben ganar.", quizQuestion: "¿Qué hace especial al regateo marroquí?", quizAnswer: "Ambas partes ganan" },
    { id: "ach-wall-street-101", name: "101 de Wall Street", description: "Aprende los fundamentos del mercado.", badgeEmoji: "📊", badgeColor: "#2d2d7a", category: "mastery", tier: "gold", xpReward: 200, goldReward: 150, requiredXp: 0, lessonText: "El mercado refleja el miedo y la codicia humana.", quizQuestion: "¿Qué impulsa los mercados financieros?", quizAnswer: "Miedo y codicia humana" },
    { id: "ach-explorer", name: "Explorador del Mapa", description: "Visita todas las zonas.", badgeEmoji: "🗺️", badgeColor: "#4a9", category: "exploration", tier: "gold", xpReward: 250, goldReward: 100, requiredXp: 0, lessonText: "Cada cultura tiene algo que enseñarte.", quizQuestion: "¿Por qué explorar todas las culturas?", quizAnswer: "Cada una enseña algo único" },
    { id: "ach-silk-road", name: "Ruta de la Seda", description: "5 transacciones en cada zona cultural.", badgeEmoji: "🧣", badgeColor: "#8b0000", category: "exploration", tier: "epic", xpReward: 400, goldReward: 250, requiredXp: 0, lessonText: "Tú conectas mundos con cada交易.", quizQuestion: "¿Qué conecta civilizaciones a través del comercio?", quizAnswer: "El intercambio cultural" },
    { id: "ach-5-star", name: "Cinco Estrellas", description: "5 calificaciones de 5 estrellas.", badgeEmoji: "⭐", badgeColor: "#ffd700", category: "social", tier: "gold", xpReward: 200, goldReward: 100, requiredXp: 0, lessonText: "Tu reputación te precede.", quizQuestion: "¿Qué abre más puertas en el comercio?", quizAnswer: "La buena reputación" },
    { id: "ach-golden-deal", name: "El Negocio Dorado", description: "Cierra un negocio por +1000 oro.", badgeEmoji: "💰", badgeColor: "#ffd700", category: "trading", tier: "epic", xpReward: 300, goldReward: 100, requiredXp: 0, lessonText: "Los grandes negocios requieren valor y preparación.", quizQuestion: "¿Qué se necesita para un gran negocio?", quizAnswer: "Valor y preparación" },
    { id: "ach-lesson-master", name: "Maestro de Lecciones", description: "Completa todas las lecciones del Consejero.", badgeEmoji: "📜", badgeColor: "#8c6b3a", category: "mastery", tier: "platinum", xpReward: 500, goldReward: 300, requiredXp: 0, lessonText: "El verdadero maestro enseña con ejemplo.", quizQuestion: "¿Qué hace a un verdadero maestro?", quizAnswer: "Enseñar con ejemplo" },
    { id: "ach-pirate-legend", name: "Leyenda Pirata", description: "Sobrevive y prospera en la Bahía Pirata.", badgeEmoji: "🏴‍☠️", badgeColor: "#5c3a6b", category: "exploration", tier: "epic", xpReward: 350, goldReward: 200, requiredXp: 0, lessonText: "Los que sobreviven mantienen el rumbo.", quizQuestion: "¿Qué mantiene al comerciante en pie?", quizAnswer: "Mantener el rumbo" },
    { id: "ach-royal-deal", name: "Negocio Real", description: "Cierra un trato con la Duquesa de Oro.", badgeEmoji: "👸", badgeColor: "#c4973a", category: "social", tier: "gold", xpReward: 250, goldReward: 150, requiredXp: 0, lessonText: "Los negocios reales requieren etiqueta y confianza.", quizQuestion: "¿Qué se necesita para negociar con la realeza?", quizAnswer: "Etiqueta y confianza" },
    { id: "ach-ascension", name: "Ascensión Celestial", description: "Alcanza nivel 30 y comercia en las Islas del Cielo.", badgeEmoji: "☁️", badgeColor: "#a0d2db", category: "mastery", tier: "diamond", xpReward: 1000, goldReward: 500, requiredXp: 0, lessonText: "Has trascendido lo material. Eres una leyenda.", quizQuestion: "¿Qué trasciende el comercio material?", quizAnswer: "El arte y la filosofía" },
    { id: "ach-secret", name: "Secreto del Mercado", description: "??? — Solo se descubre explorando.", badgeEmoji: "❓", badgeColor: "#333", category: "secret", tier: "legendary", xpReward: 500, goldReward: 500, requiredXp: 0, lessonText: "La curiosidad es la mayor virtud.", quizQuestion: "¿Qué descubriste?", quizAnswer: "La curiosidad es la mayor virtud" },
  ];

  for (const ach of achievementsData) {
    await prisma.achievement.create({ data: ach });
  }
  console.log("  ✓ 17 achievements");

  // === AVATARS ===
  const avatarsData = [
    { id: "av-gypsy-1", name: "Gitano del Camino", culture: "gypsy", emoji: "🧝", accessory: "Pandereta", description: "Nómada nato携带着 la sabiduría del camino.", unlockLevel: 1, price: 0 },
    { id: "av-gypsy-2", name: "Gitana Vidente", culture: "gypsy", emoji: "🔮", accessory: "Bola de cristal", description: "Ve el futuro de los mercados en las estrellas.", unlockLevel: 5, price: 100 },
    { id: "av-gypsy-3", name: "Rey Romaní", culture: "gypsy", emoji: "👑", accessory: "Capa de terciopelo", description: "El rey de la caravana.", unlockLevel: 15, price: 500 },
    { id: "av-chinese-1", name: "Mercader de la Seda", culture: "chinese", emoji: "👘", accessory: "Abanico", description: "Especialista en sedas y negocios sutiles.", unlockLevel: 1, price: 0 },
    { id: "av-chinese-2", name: "Monje del Comercio", culture: "chinese", emoji: "🧘", accessory: "Bastón de jade", description: "La paciencia es su arma.", unlockLevel: 8, price: 200 },
    { id: "av-chinese-3", name: "Dragon Empresario", culture: "chinese", emoji: "🐉", accessory: "Corona de oro", description: "El dragón del negocio.", unlockLevel: 20, price: 800 },
    { id: "av-moroccan-1", name: "Comerciante del Zoco", culture: "moroccan", emoji: "👳", accessory: "Túnica", description: "Maestro del regateo.", unlockLevel: 1, price: 0 },
    { id: "av-moroccan-2", name: "Sultán del Sahara", culture: "moroccan", emoji: "🧕", accessory: "Daga bereber", description: "Gobierna el desierto con oro y respeto.", unlockLevel: 10, price: 300 },
    { id: "av-moroccan-3", name: "Alquimista Dorado", culture: "moroccan", emoji: "⚗️", accessory: "Lámpara mágica", description: "Transforma especias en oro puro.", unlockLevel: 18, price: 600 },
    { id: "av-wall-1", name: "Corredor Junior", culture: "wallstreet", emoji: "📊", accessory: "Cartera de cuero", description: "Los números son su lenguaje.", unlockLevel: 1, price: 0 },
    { id: "av-wall-2", name: "Tiburón Financiero", culture: "wallstreet", emoji: "🦈", accessory: "Corbata roja", description: "Nada en aguas donde otros se ahogan.", unlockLevel: 12, price: 400 },
    { id: "av-wall-3", name: "CEO Supremo", culture: "wallstreet", emoji: "👔", accessory: "Gemelos de oro", description: "La cima del poder financiero.", unlockLevel: 25, price: 1000 },
    { id: "av-fantasy-1", name: "Pirata Aventurero", culture: "fantasy", emoji: "🏴‍☠️", accessory: "Espada curva", description: "Navega los mares buscando el mejor negocio.", unlockLevel: 1, price: 0 },
    { id: "av-fantasy-2", name: "Mago Mercader", culture: "fantasy", emoji: "🧙", accessory: "Bastón arcano", description: "Convierte la magia en moneda.", unlockLevel: 15, price: 500 },
    { id: "av-fantasy-3", name: "Dragón Comerciante", culture: "fantasy", emoji: "🐲", accessory: "Colmillo de plata", description: "El comerciante más temido de todos los reinos.", unlockLevel: 30, price: 2000 },
  ];

  for (const av of avatarsData) {
    await prisma.avatar.create({ data: av });
  }
  console.log("  ✓ 15 avatars");

  // === WAYPOINTS ===
  const waypointsData = [
    { id: "wp-v-1", zoneId: "zone-village", name: "Puesto del Pueblo", x: 60, y: 80, type: "trade_post" },
    { id: "wp-v-2", zoneId: "zone-village", name: "Fuente de la Lección", x: 180, y: 120, type: "lesson_shrine" },
    { id: "wp-g-1", zoneId: "zone-gypsy", name: "Fogata Gitana", x: 50, y: 60, type: "trade_post" },
    { id: "wp-g-2", zoneId: "zone-gypsy", name: "Caravana Móvil", x: 160, y: 100, type: "auction_house" },
    { id: "wp-c-1", zoneId: "zone-chinese", name: "Puerta del Dragón", x: 80, y: 50, type: "trade_post" },
    { id: "wp-c-2", zoneId: "zone-chinese", name: "Templo del Jade", x: 200, y: 150, type: "lesson_shrine" },
    { id: "wp-m-1", zoneId: "zone-moroccan", name: "Zoco Principal", x: 70, y: 80, type: "trade_post" },
    { id: "wp-m-2", zoneId: "zone-moroccan", name: "Casa del Té", x: 180, y: 130, type: "lesson_shrine" },
    { id: "wp-w-1", zoneId: "zone-wallstreet", name: "Bolsa de Valores", x: 100, y: 60, type: "auction_house" },
    { id: "wp-w-2", zoneId: "zone-wallstreet", name: "Torre Ejecutiva", x: 220, y: 160, type: "trade_post" },
    { id: "wp-p-1", zoneId: "zone-pirate", name: "Puerto Prohibido", x: 60, y: 70, type: "trade_post" },
    { id: "wp-p-2", zoneId: "zone-pirate", name: "Cueva del Tesoro", x: 180, y: 110, type: "treasure" },
    { id: "wp-r-1", zoneId: "zone-royal", name: "Galería Real", x: 100, y: 70, type: "auction_house" },
    { id: "wp-r-2", zoneId: "zone-royal", name: "Trono del Comercio", x: 220, y: 160, type: "treasure" },
    { id: "wp-s-1", zoneId: "zone-sky", name: "Nube de los Sueños", x: 80, y: 60, type: "portal" },
    { id: "wp-s-2", zoneId: "zone-sky", name: "Observatorio Celestial", x: 180, y: 140, type: "treasure" },
  ];

  for (const wp of waypointsData) {
    await prisma.waypoint.create({ data: wp });
  }
  console.log("  ✓ 16 waypoints");

  console.log("\nSeeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
