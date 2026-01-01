export default defineEventHandler(() => {
    return {
        status: 'ok',
        service: 'TaskFlow Frontend',
        timestamp: new Date().toISOString()
    }
})
