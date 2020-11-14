const morgan = require('morgan')

const morganConfig = {
    skip: (req, res) => {
        if (req.url === '/health') return true

        return false
    }
}

module.exports = morgan('[:date[iso]] :req[origin] :method :url :status :response-time ms', morganConfig)

