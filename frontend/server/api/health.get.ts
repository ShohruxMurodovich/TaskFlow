import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    return {
        status: 'ok',
        service: 'TaskFlow Frontend',
        timestamp: new Date().toISOString()
    }
})
