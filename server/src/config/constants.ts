export const config = {
  port: parseInt(process.env.PORT || "3001"),
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  xpPerLevel: 100,
  maxLevel: 50,
  zones: [
    { requiredLevel: 1, name: "Village Market" },
    { requiredLevel: 3, name: "Forest Outpost" },
    { requiredLevel: 5, name: "Mountain Pass" },
    { requiredLevel: 8, name: "Desert Oasis" },
    { requiredLevel: 12, name: "Harbor Town" },
    { requiredLevel: 15, name: "Pirate Cove" },
    { requiredLevel: 20, name: "Royal Capital" },
    { requiredLevel: 25, name: "Dragon's Lair" },
    { requiredLevel: 30, name: "Sky Islands" },
    { requiredLevel: 40, name: "Realm of Legends" },
  ],
} as const;
