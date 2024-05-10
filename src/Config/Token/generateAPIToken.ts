import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET


export function generateAuthToken  (tokenId : String):string{
    const jwtPayload =  {tokenId}
    return jwt.sign(jwtPayload, JWT_SECRET!,{algorithm:'HS256',noTimestamp:true})
}