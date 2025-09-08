const fs =require('fs')
const path = require('path')

class ConfigLoader {
    constructor() {
        this.config = null
        this.configPath = path.join(__dirname, '..', 'config.json')
    }

    load() {
        try {
            const configData = fs.readFileSync(this.configPath, 'utf8');
            this.config = JSON.parse(configData);
            this.validateConfig();
            return this.config;
        } catch (error) {
            console.error('Error loading config: ', error.message);
            throw error;
        }
    }

    validateConfig() {
        const required = ['server', 'webDashboard', 'bot', 'logging']

        for (const section of required) {
            if (!this.config[section]) {
                throw new Error(`Missing required config section: ${section}`)
            }
        }

        //validate server section
        if (!this.config.server.host || !this.config.server.port || !this.config.server.version) {
            throw new Error("Server config missing required fields: host, port, version")
        }
    }

    get(section, key = null) {
        if (!this.config) {
            throw new Error('Config not loaded. Call load() first.')
        }

        if (key === null) {
            return this.config[section]
        }

        return this.config[section]?.[key]
    }

    //Allow environment variable overrides
    getWithEnv(section, key, envVar = null) {
        const envValue = envVar ? process.env[envVar] : null
        return envValue || this.get(section, key)
    }
}

module.exports = new ConfigLoader()