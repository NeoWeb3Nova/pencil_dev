import "dotenv/config"; console.log("DATABASE_URL:", process.env.DATABASE_URL); import("./prisma.config.js").then(c => console.log("Config URL:", c.default.datasource.url))
