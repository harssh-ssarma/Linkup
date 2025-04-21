export const userLogout = async(req,res)=>{
    try {
        res.cookie('jwt','',{
            maxAge:0
        });
        res.status(200).send({
            success : true,
            message : "Logout Success"
        })
    } catch (error) {
        res.status(500).send({
            success : false,
            message : error
        })
        console.log(error);
    }
}