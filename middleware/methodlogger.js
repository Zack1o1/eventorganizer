const logger = (req, res, next)=>{
    console.log('_________________')
    console.log(`Method: ${req.method}\nURL: ${req.originalUrl}`)
    console.log('_________________\n')
    next()
} 
export default logger