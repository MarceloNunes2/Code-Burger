import  jwt  from 'jsonwebtoken'
import authConfig from '../../config/auth'

export default(request,response,next)=>{
         const authToken = request.headers.authorization
         if(!authToken){
            return response.status(401).json({error: 'Token não enviado' })
        }
         
        const token = authToken.split(' ')[1];

        try {
            
            jwt.verify(token,authConfig.secret, function (err,decoded){
                if(err){
                    console.error(err)
                    throw new Error()
                }
                
                request.userId = decoded.id
                request.useName = decoded.name
                return next()
                 
            })
        } catch (err) {
            return response.status(401).json({error: 'Token Invalido'})
        }

         
}

    

