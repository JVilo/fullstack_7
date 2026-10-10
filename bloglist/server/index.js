console.log('[DEBUG] index.js: script started')

const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

console.log('[DEBUG] index.js: about to call app.listen with port:', config.PORT)

app.listen(config.PORT, () => {
  console.log(`[DEBUG] index.js: app.listen callback fired successfully on port ${config.PORT}`)
  logger.info(`Server running on port ${config.PORT}`)
})