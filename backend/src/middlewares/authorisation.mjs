

export const authorize = (...requiredRole) => async (req,res,next) => {

        const role = req.user.role;
        
        if (requiredRole.includes(role)){
            next();
        }
        else{
        return res.status(401).send("not authorized");}

   
}