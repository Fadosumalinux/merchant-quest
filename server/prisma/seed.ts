import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // === ZONES ===
  const zones = await Promise.all([
    prisma.zone.create({
      data: {
        id: "zone-village",
        name: "Village Market",
        description: "El mercado principal donde todos los comerciantes principiantes dan sus primeros pasos. Puestos de colores y el bullicio del trueque.",
        culture: "universal",
        requiredLevel: 1,
        mapX: 200,
        mapY: 300,
        width: 280,
        height: 220,
        bgGradient: "linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-gypsy",
        name: "Romani Caravan",
        description: "La caravana gitana viaja entre pueblos. Aquí se negocia con cantos, bailes y la astucia del camino. Todo se vale si hay talento.",
        culture: "gypsy",
        requiredLevel: 3,
        mapX: 550,
        mapY: 180,
        width: 260,
        height: 200,
        bgGradient: "linear-gradient(135deg, #8b2252 0%, #c44569 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-chinese",
        name: "Dragon Bazaar",
        description: "El mercado del dragón. Sedas, porcelana y los secretos mejor guardados del comercio oriental. El respeto es la moneda más valiosa.",
        culture: "chinese",
        requiredLevel: 5,
        mapX: 900,
        mapY: 120,
        width: 300,
        height: 240,
        bgGradient: "linear-gradient(135deg, #8b0000 0%, #cc3300 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-moroccan",
        name: "Medina de Fez",
        description: "Los zocos marroquíes desbordan color, especias y artesanía. Negocia con paciencia y el té nunca falta en la mesa.",
        culture: "moroccan",
        requiredLevel: 8,
        mapX: 1280,
        mapY: 350,
        width: 280,
        height: 220,
        bgGradient: "linear-gradient(135deg, #c2720d 0%, #e8a838 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-wallstreet",
        name: "Wall Street Tower",
        description: "La torre de los high-rollers. Contratos, derivados y la adrenalina del mercado. Aquí se juega con números y nervios de acero.",
        culture: "wallstreet",
        requiredLevel: 12,
        mapX: 550,
        mapY: 520,
        width: 300,
        height: 240,
        bgGradient: "linear-gradient(135deg, #1a1a4e 0%, #2d2d7a 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-pirate",
        name: "Pirate Cove",
        description: "La bahía de los piratas. Mercancía robada, mapas del tesoro y rum. Aquí la confianza se gana con espada en mano.",
        culture: "fantasy",
        requiredLevel: 15,
        mapX: 1650,
        mapY: 200,
        width: 260,
        height: 200,
        bgGradient: "linear-gradient(135deg, #2c1654 0%, #5c3a6b 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-royal",
        name: "Royal Capital",
        description: "La capital real. Comercio de lujo, joyas de la corona y los tratos más exclusivos del reino.",
        culture: "universal",
        requiredLevel: 20,
        mapX: 900,
        mapY: 650,
        width: 300,
        height: 240,
        bgGradient: "linear-gradient(135deg, #8c6b3a 0%, #c4973a 100%)",
      },
    }),
    prisma.zone.create({
      data: {
        id: "zone-sky",
        name: "Sky Islands",
        description: "Las islas flotantes del comercio celestial. Solo los maestros pueden llegar aquí. Los negocios se hacen entre las nubes.",
        culture: "fantasy",
        requiredLevel: 30,
        mapX: 1400,
        mapY: 600,
        width: 280,
        height: 220,
        bgGradient: "linear-gradient(135deg, #6b8c9a 0%, #a0d2db 100%)",
      },
    }),
  ]);

  // === ITEMS BY CULTURE ===
  const items = await Promise.all([
    // UNIVERSAL
    prisma.item.create({ data: { id: "item-wheat", name: "Trigo", description: "El alimento básico. Siempre tiene demanda.", category: "food", rarity: "common", basePrice: 5, emoji: "🌾", culture: "universal" } }),
    prisma.item.create({ data: { id: "item-water", name: "Agua Pura", description: "Líquido vital para todo comerciante.", category: "food", rarity: "common", basePrice: 3, emoji: "💧", culture: "universal" } }),
    prisma.item.create({ data: { id: "item-wood", name: "Madera", description: "Material de construcción básico.", category: "artifacts", rarity: "common", basePrice: 8, emoji: "🪵", culture: "universal" } }),
    // GYPSY
    prisma.item.create({ data: { id: "item-horseshoe", name: "Herradura de la Suerte", description: "Dice la gitana que trae fortuna al que la lleva.", category: "jewelry", rarity: "uncommon", basePrice: 25, emoji: "🧲", culture: "gypsy" } }),
    prisma.item.create({ data: { id: "item-crystal", name: "Cristal Adivino", description: "Una bola de cristal que revela tendencias del mercado.", category: "artifacts", rarity: "rare", basePrice: 80, emoji: "🔮", culture: "gypsy" } }),
    prisma.item.create({ data: { id: "item-tambourine", name: "Pandereta Mágica", description: "Su ritmo atrae clientes de todas las tierras.", category: "instruments", rarity: "uncommon", basePrice: 30, emoji: "🪘", culture: "gypsy" } }),
    prisma.item.create({ data: { id: "item-horse", name: "Caballo Gitano", description: "Un corcel fiel que viaja sin descanso entre ferias.", category: "animals", rarity: "rare", basePrice: 120, emoji: "🐴", culture: "gypsy" } }),
    prisma.item.create({ data: { id: "item-cloak", name: "Capa del Camino", description: "Protege del sol y la lluvia en las rutas comerciales.", category: "textiles", rarity: "common", basePrice: 15, emoji: "🧥", culture: "gypsy" } }),
    prisma.item.create({ data: { id: "item-earring", name: "Pendientes de Plata", description: "Joyas que cuentan historias de generación en generación.", category: "jewelry", rarity: "uncommon", basePrice: 40, emoji: "✨", culture: "gypsy" } }),
    // CHINESE
    prisma.item.create({ data: { id: "item-silk", name: "Seda Imperial", description: "La seda más fina del Imperio. Cada hilo es una obra de arte.", category: "textiles", rarity: "rare", basePrice: 90, emoji: "🧣", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-porcelain", name: "Porcelana Ming", description: "Pieza de colección que vale una fortuna en Occidente.", category: "artifacts", rarity: "epic", basePrice: 200, emoji: "🏺", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-tea", name: "Té Dragón Negro", description: "El té más raro. Su sabor despierta la mente del comerciante.", category: "food", rarity: "uncommon", basePrice: 35, emoji: "🍵", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-fan", name: "Abanico de Guerra", description: "Un abanico que esconde filo. Belleza y peligro.", category: "weapons", rarity: "rare", basePrice: 70, emoji: "🪭", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-jade", name: "Jade del Dragón", description: "Piedra sagrada que otorga sabiduría en los negocios.", category: "jewelry", rarity: "epic", basePrice: 180, emoji: "💎", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-panda", name: "Oso Panda Bebé", description: "Una mascota exótica que nadie puede resistir.", category: "animals", rarity: "legendary", basePrice: 500, emoji: "🐼", culture: "chinese" } }),
    prisma.item.create({ data: { id: "item-lantern", name: "Farol de la Fortuna", description: "Ilumina el camino hacia los mejores negocios.", category: "artifacts", rarity: "common", basePrice: 20, emoji: "🏮", culture: "chinese" } }),
    // MOROCCAN
    prisma.item.create({ data: { id: "item-spice", name: "Especias del Sahara", description: "Canela, cúrcuma y azafrán. El oro rojo del desierto.", category: "food", rarity: "uncommon", basePrice: 30, emoji: "🌶️", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-carpet", name: "Tapiz de Fez", description: "Un tapiz tejido a mano durante meses. Cada nudo cuenta una historia.", category: "textiles", rarity: "rare", basePrice: 110, emoji: "🧶", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-lamp", name: "Lámpara de Aladdin", description: "Dicen que si la frotas... bueno, al menos ilumina.", category: "artifacts", rarity: "epic", basePrice: 160, emoji: "🪔", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-camel", name: "Camello del Desierto", description: "El mejor compañero para cruzar las dunas cargado de mercancía.", category: "animals", rarity: "rare", basePrice: 140, emoji: "🐫", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-hookah", name: "Narguile del Rey", description: "Un narguile tallado en oro. Los tratos se sellan entre bocanadas.", category: "artifacts", rarity: "uncommon", basePrice: 45, emoji: "🫧", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-dagger", name: "Daga Bereber", description: "Cuchilla ceremonial con incrustaciones de coral y plata.", category: "weapons", rarity: "rare", basePrice: 85, emoji: "🗡️", culture: "moroccan" } }),
    prisma.item.create({ data: { id: "item-tagine", name: "Cous Cous Mágico", description: "Quien come de este plato, nunca pierde un negocio.", category: "food", rarity: "uncommon", basePrice: 25, emoji: "🥘", culture: "moroccan" } }),
    // WALL STREET
    prisma.item.create({ data: { id: "item-stock", name: "Acciones Apple", description: "Paquete de 100 acciones. El mercado sube, el mercado baja.", category: "artifacts", rarity: "uncommon", basePrice: 50, emoji: "📈", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-bond", name: "Bonos del Tesoro", description: "Inversión segura para comerciantes conservadores.", category: "artifacts", rarity: "common", basePrice: 35, emoji: "🏛️", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-briefcase", name: "Cartera de Cuero", description: "Contiene contratos millonarios y un café frío.", category: "textiles", rarity: "uncommon", basePrice: 40, emoji: "💼", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-cufflinks", name: "Gemelos de Oro", description: "Los gemelos distinguen al verdadero magnate.", category: "jewelry", rarity: "rare", basePrice: 75, emoji: "👔", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-limousine", name: "Limusina Negra", description: "Transporte ejecutivo. Llegar con estilo es parte del negocio.", category: "artifacts", rarity: "epic", basePrice: 250, emoji: "🚗", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-cigar", name: "Puro Cubano", description: "Un puro que solo se fuma después de cerrar un millón.", category: "food", rarity: "common", basePrice: 15, emoji: " cigarro", culture: "wallstreet" } }),
    prisma.item.create({ data: { id: "item-monocle", name: "Monocle Financiero", description: "Para leer las letras finas de los contratos.", category: "jewelry", rarity: "uncommon", basePrice: 30, emoji: "🧐", culture: "wallstreet" } }),
    // FANTASY / PIRATE
    prisma.item.create({ data: { id: "item-rum", name: "Ron del Pirata", description: "El mejor Ron de los siete mares. Calienta el alma.", category: "food", rarity: "common", basePrice: 12, emoji: "🍺", culture: "fantasy" } }),
    prisma.item.create({ data: { id: "item-parrot", name: "Loro Parlanchín", description: "Repite los precios y espía a la competencia.", category: "animals", rarity: "uncommon", basePrice: 35, emoji: "🦜", culture: "fantasy" } }),
    prisma.item.create({ data: { id: "item-map", name: "Mapa del Tesoro", description: "Xmarca el lugar... o no. Las referencias no son confiables.", category: "artifacts", rarity: "rare", basePrice: 95, emoji: "🗺️", culture: "fantasy" } }),
    prisma.item.create({ data: { id: "item-sword", name: "Espada del Capitán", description: "Acero valyrio... digo, acero de los mares del sur.", category: "weapons", rarity: "epic", basePrice: 180, emoji: "⚔️", culture: "fantasy" } }),
    prisma.item.create({ data: { id: "item-compass", name: "Brújula Encantada", description: "Siempre apunta al negocio más rentable.", category: "artifacts", rarity: "rare", basePrice: 70, emoji: "🧭", culture: "fantasy" } }),
    prisma.item.create({ data: { id: "item-cannon", name: "Cañón Portátil", description: "Para negociaciones que requieren... énfasis.", category: "weapons", rarity: "epic", basePrice: 200, emoji: "💣", culture: "fantasy" } }),
  ]);

  // === NPCs ===
  await Promise.all([
    // Village Market
    prisma.npc.create({ data: { id: "npc-village-1", name: "Doña Mercadera", zoneId: "zone-village", role: "merchant", culture: "universal", personality: "friendly", avatarEmoji: "👵", dialog: "¡Bienvenido, joven! Aquí aprenderás los secretos del trueque. ¿Qué necesitas?", tradeBonus: 5, teachesBadge: "ach-first-trade" } }),
    prisma.npc.create({ data: { id: "npc-village-2", name: "El Tío Banco", zoneId: "zone-village", role: "banker", culture: "universal", personality: "stern", avatarEmoji: "🧔", dialog: "Tu oro está seguro conmigo. Los intereses se calculan con precisión.", tradeBonus: 0 } }),
    prisma.npc.create({ data: { id: "npc-village-3", name: "Sabio Pueblo", zoneId: "zone-village", role: "sage", culture: "universal", personality: "wise", avatarEmoji: "🧙", dialog: "El comercio es un arte. Cada transacción es una lección.", tradeBonus: 0, teachesBadge: "ach-lesson-1" } }),
    // Romani Caravan
    prisma.npc.create({ data: { id: "npc-gypsy-1", name: "Flor de Lis", zoneId: "zone-gypsy", role: "merchant", culture: "gypsy", personality: "witty", avatarEmoji: "💃", dialog: "¡Ven, ven! Mis cristales ven el futuro de tus inversiones. ¿Compramos o vendemos hoy?", tradeBonus: 10, teachesBadge: "ach-gypsy-initiation" } }),
    prisma.npc.create({ data: { id: "npc-gypsy-2", name: "Rey Romaní", zoneId: "zone-gypsy", role: "quest_giver", culture: "gypsy", personality: "mysterious", avatarEmoji: "👑", dialog: "El camino del comerciante gitano no es fácil. Pero si superas la prueba, ganarás mi respeto.", tradeBonus: 15, teachesBadge: "ach-gypsy-master" } }),
    prisma.npc.create({ data: { id: "npc-gypsy-3", name: "Violinista Nocturno", zoneId: "zone-gypsy", role: "merchant", culture: "gypsy", personality: "friendly", avatarEmoji: "🎻", dialog: "Mi violín atrae clientes y mi instinto cierra negocios.", tradeBonus: 8 } }),
    // Dragon Bazaar
    prisma.npc.create({ data: { id: "npc-chinese-1", name: "Maestro Li Wei", zoneId: "zone-chinese", role: "merchant", culture: "chinese", personality: "wise", avatarEmoji: "👴", dialog: "El comercio es como el ajedrez: piensa tres movimientos adelante.", tradeBonus: 12, teachesBadge: "ach-chinese-wisdom" } }),
    prisma.npc.create({ data: { id: "npc-chinese-2", name: "Dragon Rojo", zoneId: "zone-chinese", role: "blacksmith", culture: "chinese", personality: "stern", avatarEmoji: "🐉", dialog: "Forjo acero que corta mercados. ¿Qué necesitas temperado?", tradeBonus: 8 } }),
    prisma.npc.create({ data: { id: "npc-chinese-3", name: "Concubina Luna", zoneId: "zone-chinese", role: "merchant", culture: "chinese", personality: "mysterious", avatarEmoji: "🌙", dialog: "La seda que vendo no solo cubre, cuenta historias. Cada hilo tiene un precio... y un secreto.", tradeBonus: 10, teachesBadge: "ach-silk-road" } }),
    // Medina de Fez
    prisma.npc.create({ data: { id: "npc-moroccan-1", name: "Hassan el Negociador", zoneId: "zone-moroccan", role: "merchant", culture: "moroccan", personality: "witty", avatarEmoji: "🕌", dialog: "¡Té, té! Pero primero, hablemos de negocios. ¿Cuál es tu precio?", tradeBonus: 10, teachesBadge: "ach-moroccan-haggler" } }),
    prisma.npc.create({ data: { id: "npc-moroccan-2", name: "Amina del Zoco", zoneId: "zone-moroccan", role: "merchant", culture: "moroccan", personality: "friendly", avatarEmoji: "🧕", dialog: "Mis tapices son el orgullo de Fez. Cada nudo es un día de trabajo y amor.", tradeBonus: 12 } }),
    prisma.npc.create({ data: { id: "npc-moroccan-3", name: "Jeque Dorado", zoneId: "zone-moroccan", role: "banker", culture: "moroccan", personality: "stern", avatarEmoji: "👳", dialog: "El oro se respeta, el respeto se gana. ¿Cuánto traes en tu bolsa?", tradeBonus: 5, teachesBadge: "ach-golden-deal" } }),
    // Wall Street
    prisma.npc.create({ data: { id: "npc-wall-1", name: "Max Bullington III", zoneId: "zone-wallstreet", role: "merchant", culture: "wallstreet", personality: "stern", avatarEmoji: "📊", dialog: "Numbers don't lie. But I do. Just kidding. Or am I?", tradeBonus: 15, teachesBadge: "ach-wall-street-101" } }),
    prisma.npc.create({ data: { id: "npc-wall-2", name: "Victoria Shortsell", zoneId: "zone-wallstreet", role: "quest_giver", culture: "wallstreet", personality: "witty", avatarEmoji: "📉", dialog: "Vendo en corto cuando otros compran. ¿Tienes lo que hay que tener para jugar en la liga mayor?", tradeBonus: 20, teachesBadge: "ach-market-master" } }),
    prisma.npc.create({ data: { id: "npc-wall-3", name: "Chef Finance", zoneId: "zone-wallstreet", role: "merchant", culture: "wallstreet", personality: "friendly", avatarEmoji: "🧑‍🍳", dialog: "Cocino portfolios como platos. La diversificación es la clave del sabor financiero.", tradeBonus: 10 } }),
    // Pirate Cove
    prisma.npc.create({ data: { id: "npc-pirate-1", name: "Capitán Barba Roja", zoneId: "zone-pirate", role: "merchant", culture: "fantasy", personality: "mysterious", avatarEmoji: "🏴‍☠️", dialog: "¡Arr! Compro y vendo todo lo que el mar trae. ¿Tienes agallas para negociar?", tradeBonus: 12 } }),
    prisma.npc.create({ data: { id: "npc-pirate-2", name: "Sirena del Puerto", zoneId: "zone-pirate", role: "quest_giver", culture: "fantasy", personality: "witty", avatarEmoji: "🧜", dialog: "Los tesoros más valiosos no están en el fondo del mar... están en los libros de contabilidad.", tradeBonus: 8, teachesBadge: "ach-pirate-legend" } }),
    // Royal Capital
    prisma.npc.create({ data: { id: "npc-royal-1", name: "Duquesa de Oro", zoneId: "zone-royal", role: "merchant", culture: "universal", personality: "stern", avatarEmoji: "👸", dialog: "Solo negocio con quien tenga clase. ¿Demuestras que la tienes?", tradeBonus: 20, teachesBadge: "ach-royal-deal" } }),
    prisma.npc.create({ data: { id: "npc-royal-2", name: "El Consejero", zoneId: "zone-royal", role: "sage", culture: "universal", personality: "wise", avatarEmoji: "🎩", dialog: "He visto comerciantes subir y caer. Los que perduran son los que aprenden.", tradeBonus: 0, teachesBadge: "ach-lesson-master" } }),
    // Sky Islands
    prisma.npc.create({ data: { id: "npc-sky-1", name: "Comerciante Celestial", zoneId: "zone-sky", role: "merchant", culture: "fantasy", personality: "mysterious", avatarEmoji: "☁️", dialog: "Aquí arriba, el comercio trasciende lo material. Negociamos con ideas y sueños.", tradeBonus: 25, teachesBadge: "ach-ascension" } }),
  ]);

  // === ACHIEVEMENTS ===
  await Promise.all([
    // Trading milestones
    prisma.achievement.create({ data: { id: "ach-first-trade", name: "Primer Intercambio", description: "Completa tu primera transacción en el mercado.", badgeEmoji: "🤝", badgeColor: "#cd7f32", category: "trading", tier: "bronze", xpReward: 50, goldReward: 25, requiredXp: 0, lessonText: "Lección: Todo gran comerciante empezó con un simple trueque. La confianza se construye交易 en交易交易.", quizQuestion: "¿Qué es lo más importante en tu primera transacción?", quizAnswer: "Confianza" } }),
    prisma.achievement.create({ data: { id: "ach-10-trades", name: "Comerciante Activo", description: "Completa 10 transacciones exitosas.", badgeEmoji: "⭐", badgeColor: "#c0c0c0", category: "trading", tier: "silver", xpReward: 100, goldReward: 50, requiredXp: 0, lessonText: "Lección: La constancia es la madre del éxito. Cada交易 te enseña algo nuevo sobre el mercado y sobre ti mismo.", quizQuestion: "¿Qué haces cuando un negocio no sale como esperabas?", quizAnswer: "Aprendo y sigo adelante" } }),
    prisma.achievement.create({ data: { id: "ach-50-trades", name: "Magnate del Mercado", description: "Completa 50 transacciones sin infringir reglas.", badgeEmoji: "🏆", badgeColor: "#ffd700", category: "trading", tier: "gold", xpReward: 300, goldReward: 200, requiredXp: 0, lessonText: "Lección: Los verdaderos magnates no solo ganan dinero — ganan respeto. Tu reputación es tu activo más valioso.", quizQuestion: "¿Qué define a un verdadero magnate del comercio?", quizAnswer: "Respeto y ética" } }),
    prisma.achievement.create({ data: { id: "ach-100-trades", name: "Leyenda Viva", description: "100 transacciones perfectas. Eres una leyenda del comercio.", badgeEmoji: "👑", badgeColor: "#e5e4e2", category: "trading", tier: "platinum", xpReward: 500, goldReward: 500, requiredXp: 0, lessonText: "Lección: Has demostrado que el comercio justo no es solo un ideal — es un estilo de vida. Tu nombre será recordado.", quizQuestion: "¿Qué legado deja un comerciante legendario?", quizAnswer: "Un ejemplo para otros" } }),
    // Cultural badges
    prisma.achievement.create({ data: { id: "ach-gypsy-initiation", name: "Iniciado Gitano", description: "Aprende los secretos del trueque con Flor de Lis.", badgeEmoji: "💃", badgeColor: "#c44569", category: "exploration", tier: "bronze", xpReward: 75, goldReward: 30, requiredXp: 0, lessonText: "Lección del Camino: El comercio gitano se basa en la intuición y el encanto. No vendes productos — vendes experiencias y historias.", quizQuestion: "¿Qué vende realmente un comerciante gitano?", quizAnswer: "Experiencias e historias" } }),
    prisma.achievement.create({ data: { id: "ach-chinese-wisdom", name: "Sabiduría del Dragón", description: "Domina el arte del comercio estratégico con Maestro Li Wei.", badgeEmoji: "🐉", badgeColor: "#cc0000", category: "exploration", tier: "silver", xpReward: 120, goldReward: 80, requiredXp: 0, lessonText: "Lección del Dragón: En el comercio chino, la paciencia es poder. El mejor negocio es el que nadie ve venir.", quizQuestion: "¿Cuál es el arma secreta del comercio oriental?", quizAnswer: "Paciencia y estrategia" } }),
    prisma.achievement.create({ data: { id: "ach-moroccan-haggler", name: "Maestro del Regateo", description: "Aprende el arte del regateo marroquí en la Medina.", badgeEmoji: "🕌", badgeColor: "#e8a838", category: "exploration", tier: "silver", xpReward: 120, goldReward: 80, requiredXp: 0, lessonText: "Lección del Zoco: El regateo no es confrontación — es una danza. Ambas partes deben ganar para que el negocio sea verdadero.", quizQuestion: "¿Qué hace especial al regateo marroquí?", quizAnswer: "Ambas partes ganan" } }),
    prisma.achievement.create({ data: { id: "ach-wall-street-101", name: "101 de Wall Street", description: "Aprende los fundamentos del mercado financiero.", badgeEmoji: "📊", badgeColor: "#2d2d7a", category: "mastery", tier: "gold", xpReward: 200, goldReward: 150, requiredXp: 0, lessonText: "Lección: El mercado no sube ni baja — refleja el miedo y la codicia humana. Quien entiende a las personas, entiende el mercado.", quizQuestion: "¿Qué impulsa realmente los mercados financieros?", quizAnswer: "Miedo y codicia humana" } }),
    // Exploration badges
    prisma.achievement.create({ data: { id: "ach-explorer", name: "Explorador del Mapa", description: "Visita todas las zonas disponibles.", badgeEmoji: "🗺️", badgeColor: "#4a9", category: "exploration", tier: "gold", xpReward: 250, goldReward: 100, requiredXp: 0, lessonText: "Lección: El mundo del comercio es infinito. Cada cultura tiene algo que enseñarte. Nunca dejes de explorar.", quizQuestion: "¿Por qué es importante explorar todas las culturas comerciales?", quizAnswer: "Cada una enseña algo único" } }),
    prisma.achievement.create({ data: { id: "ach-silk-road", name: "Ruta de la Seda", description: "Completa 5 transacciones en cada zona cultural.", badgeEmoji: "🧣", badgeColor: "#8b0000", category: "exploration", tier: "epic", xpReward: 400, goldReward: 250, requiredXp: 0, lessonText: "Lección: La Ruta de la Seda conectó culturas a través del comercio. Tú también conectas mundos con cada交易.", quizQuestion: "¿Qué conecta realmente a las civilizaciones a través del comercio?", quizAnswer: "El intercambio cultural" } }),
    // Social badges
    prisma.achievement.create({ data: { id: "ach-5-star", name: "Cinco Estrellas", description: "Recibe 5 calificaciones de 5 estrellas de otros jugadores.", badgeEmoji: "⭐", badgeColor: "#ffd700", category: "social", tier: "gold", xpReward: 200, goldReward: 100, requiredXp: 0, lessonText: "Lección: Tu reputación te precede. Ser justo y puntual abre puertas que el dinero solo no puede.", quizQuestion: "¿Qué abre más puertas en el comercio?", quizAnswer: "La buena reputación" } }),
    prisma.achievement.create({ data: { id: "ach-golden-deal", name: "El Negocio Dorado", description: "Cierra un negocio por más de 1000 monedas de oro.", badgeEmoji: "💰", badgeColor: "#ffd700", category: "trading", tier: "epic", xpReward: 300, goldReward: 100, requiredXp: 0, lessonText: "Lección: Los grandes negocios requieren valor, preparación y un toque de audacia. ¡Bien jugado!", quizQuestion: "¿Qué se necesita para cerrar un gran negocio?", quizAnswer: "Valor y preparación" } }),
    prisma.achievement.create({ data: { id: "ach-lesson-master", name: "Maestro de Lecciones", description: "Completa todas las lecciones de sabiduría del Consejero.", badgeEmoji: "📜", badgeColor: "#8c6b3a", category: "mastery", tier: "platinum", xpReward: 500, goldReward: 300, requiredXp: 0, lessonText: "Lección Final: El verdadero maestro no es quien sabe más, sino quien enseña con ejemplo. Tu sabiduría ahora ilumina a otros.", quizQuestion: "¿Qué hace a un verdadero maestro del comercio?", quizAnswer: "Enseñar con ejemplo" } }),
    prisma.achievement.create({ data: { id: "ach-pirate-legend", name: "Leyenda Pirata", description: "Sobrevive y prospera en la Bahía de los Piratas.", badgeEmoji: "🏴‍☠️", badgeColor: "#5c3a6b", category: "exploration", tier: "epic", xpReward: 350, goldReward: 200, requiredXp: 0, lessonText: "Lección del Pirata: En el comercio, como en el mar, hay tormentas. Los que sobreviven son los que mantienen el rumbo.", quizQuestion: "¿Qué mantiene a un comerciante en pie durante las tormentas?", quizAnswer: "Mantener el rumbo" } }),
    prisma.achievement.create({ data: { id: "ach-royal-deal", name: "Negocio Real", description: "Cierra un trato con la Duquesa de Oro en la Capital.", badgeEmoji: "👸", badgeColor: "#c4973a", category: "social", tier: "gold", xpReward: 250, goldReward: 150, requiredXp: 0, lessonText: "Lección: Los negocios reales requieren etiqueta, preparación y confianza. No cualquiera llega al trono.", quizQuestion: "¿Qué se necesita para negociar con la realeza?", quizAnswer: "Etiqueta y confianza" } }),
    prisma.achievement.create({ data: { id: "ach-ascension", name: "Ascensión Celestial", description: "Alcanza el nivel 30 y comercia en las Islas del Cielo.", badgeEmoji: "☁️", badgeColor: "#a0d2db", category: "mastery", tier: "diamond", xpReward: 1000, goldReward: 500, requiredXp: 0, lessonText: "Lección Final: Has trascendido lo material. Tu comercio ahora es arte, filosofía y legado. Eres una leyenda viviente.", quizQuestion: "¿Qué trasciende el comercio material?", quizAnswer: "El arte y la filosofía" } }),
    // Secret badge
    prisma.achievement.create({ data: { id: "ach-secret", name: "Secreto del Mercado", description: "??? — Algunos secretos se descubren explorando...", badgeEmoji: "❓", badgeColor: "#333", category: "secret", tier: "legendary", xpReward: 500, goldReward: 500, requiredXp: 0, lessonText: "Has encontrado el secreto mejor guardado del mercado. Los verdaderos comerciantes saben que la curiosidad es la mayor virtud.", quizQuestion: "¿Qué descubriste?", quizAnswer: "La curiosidad es la mayor virtud" } }),
  ]);

  // === AVATARS ===
  await Promise.all([
    // GYPSY
    prisma.avatar.create({ data: { id: "av-gypsy-1", name: "Gitano del Camino", culture: "gypsy", emoji: "🧝", accessory: "Pandereta", description: "Nómada nato,携带着 la sabiduría del camino.", unlockLevel: 1, price: 0 } }),
    prisma.avatar.create({ data: { id: "av-gypsy-2", name: "Gitana Vidente", culture: "gypsy", emoji: "🔮", accessory: "Bola de cristal", description: "Ve el futuro de los mercados en las estrellas.", unlockLevel: 5, price: 100 } }),
    prisma.avatar.create({ data: { id: "av-gypsy-3", name: "Rey Romaní", culture: "gypsy", emoji: "👑", accessory: "Capa de terciopelo", description: "El rey de la caravana. Su palabra es ley.", unlockLevel: 15, price: 500 } }),
    // CHINESE
    prisma.avatar.create({ data: { id: "av-chinese-1", name: "Mercader de la Seda", culture: "chinese", emoji: "👘", accessory: "Abanico", description: "Especialista en sedas y negocios sutiles.", unlockLevel: 1, price: 0 } }),
    prisma.avatar.create({ data: { id: "av-chinese-2", name: "Monje del Comercio", culture: "chinese", emoji: "🧘", accessory: "Bastón de jade", description: "La paciencia es su arma. El silencio, su estrategia.", unlockLevel: 8, price: 200 } }),
    prisma.avatar.create({ data: { id: "av-chinese-3", name: "Dragon Empresario", culture: "chinese", emoji: "🐉", accessory: "Corona de oro", description: "El.dragón del negocio. Nadie negocia más fuerte.", unlockLevel: 20, price: 800 } }),
    // MOROCCAN
    prisma.avatar.create({ data: { id: "av-moroccan-1", name: "Comerciante del Zoco", culture: "moroccan", emoji: "👳", accessory: "Túnica", description: "Maestro del regateo en los zocos más coloridos.", unlockLevel: 1, price: 0 } }),
    prisma.avatar.create({ data: { id: "av-moroccan-2", name: "Sultán del Sahara", culture: "moroccan", emoji: "🧕", accessory: "Daga bereber", description: "Gobierna el desierto con oro y respeto.", unlockLevel: 10, price: 300 } }),
    prisma.avatar.create({ data: { id: "av-moroccan-3", name: "Alquimista Dorado", culture: "moroccan", emoji: "⚗️", accessory: "Lámpara mágica", description: "Transforma especias en oro puro.", unlockLevel: 18, price: 600 } }),
    // WALL STREET
    prisma.avatar.create({ data: { id: "av-wall-1", name: "Corredor Junior", culture: "wallstreet", emoji: "📊", accessory: "Cartera de cuero", description: "Los números son su lenguaje. El profit, su pasión.", unlockLevel: 1, price: 0 } }),
    prisma.avatar.create({ data: { id: "av-wall-2", name: "Tiburón Financiero", culture: "wallstreet", emoji: "🦈", accessory: "Corbata roja", description: "Nada en aguas donde otros se ahogan.", unlockLevel: 12, price: 400 } }),
    prisma.avatar.create({ data: { id: "av-wall-3", name: "CEO Supremo", culture: "wallstreet", emoji: "👔", accessory: "Gemelos de oro", description: "La cima del poder financiero. Su imperio no tiene límites.", unlockLevel: 25, price: 1000 } }),
    // FANTASY
    prisma.avatar.create({ data: { id: "av-fantasy-1", name: "Pirata Aventurero", culture: "fantasy", emoji: "🏴‍☠️", accessory: "Espada curva", description: "Navega los mares buscando el mejor negocio.", unlockLevel: 1, price: 0 } }),
    prisma.avatar.create({ data: { id: "av-fantasy-2", name: "Mago Mercader", culture: "fantasy", emoji: "🧙", accessory: "Bastón arcano", description: "Convierte la magia en moneda de cambio.", unlockLevel: 15, price: 500 } }),
    prisma.avatar.create({ data: { id: "av-fantasy-3", name: "Dragón Comerciante", culture: "fantasy", emoji: "🐲", accessory: "Colmillo de plata", description: "El comerciante más temido y respetado de todos los reinos.", unlockLevel: 30, price: 2000 } }),
  ]);

  // === WAYPOINTS ===
  await Promise.all([
    prisma.waypoint.create({ data: { id: "wp-v-1", zoneId: "zone-village", name: "Puesto del Pueblo", x: 60, y: 80, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-v-2", zoneId: "zone-village", name: "Fuente de la Lección", x: 180, y: 120, type: "lesson_shrine" } }),
    prisma.waypoint.create({ data: { id: "wp-g-1", zoneId: "zone-gypsy", name: "Fogata Gitana", x: 50, y: 60, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-g-2", zoneId: "zone-gypsy", name: "Caravana Móvil", x: 160, y: 100, type: "auction_house" } }),
    prisma.waypoint.create({ data: { id: "wp-c-1", zoneId: "zone-chinese", name: "Puerta del Dragón", x: 80, y: 50, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-c-2", zoneId: "zone-chinese", name: "Templo del Jade", x: 200, y: 150, type: "lesson_shrine" } }),
    prisma.waypoint.create({ data: { id: "wp-m-1", zoneId: "zone-moroccan", name: "Zoco Principal", x: 70, y: 80, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-m-2", zoneId: "zone-moroccan", name: "Casa del Té", x: 180, y: 130, type: "lesson_shrine" } }),
    prisma.waypoint.create({ data: { id: "wp-w-1", zoneId: "zone-wallstreet", name: "Bolsa de Valores", x: 100, y: 60, type: "auction_house" } }),
    prisma.waypoint.create({ data: { id: "wp-w-2", zoneId: "zone-wallstreet", name: "Torre Ejecutiva", x: 220, y: 160, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-p-1", zoneId: "zone-pirate", name: "Puerto Prohibido", x: 60, y: 70, type: "trade_post" } }),
    prisma.waypoint.create({ data: { id: "wp-p-2", zoneId: "zone-pirate", name: "Cueva del Tesoro", x: 180, y: 110, type: "treasure" } }),
    prisma.waypoint.create({ data: { id: "wp-r-1", zoneId: "zone-royal", name: "Galería Real", x: 100, y: 70, type: "auction_house" } }),
    prisma.waypoint.create({ data: { id: "wp-r-2", zoneId: "zone-royal", name: "Trono del Comercio", x: 220, y: 160, type: "treasure" } }),
    prisma.waypoint.create({ data: { id: "wp-s-1", zoneId: "zone-sky", name: "Nube de los Sueños", x: 80, y: 60, type: "portal" } }),
    prisma.waypoint.create({ data: { id: "wp-s-2", zoneId: "zone-sky", name: "Observatorio Celestial", x: 180, y: 140, type: "treasure" } }),
  ]);

  console.log("Seed complete! Created:");
  console.log(`  ${zones.length} zones`);
  console.log(`  ${items.length} items`);
  console.log(`  25 NPCs`);
  console.log(`  18 achievements`);
  console.log(`  15 avatars`);
  console.log(`  16 waypoints`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
