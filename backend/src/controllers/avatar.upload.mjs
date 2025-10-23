import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_API_KEY } from '../config.mjs'

export const supabase = createClient( SUPABASE_URL ,SUPABASE_API_KEY);


export const newUpload = async (req,res) => {
    try{
        const {imageType} =  req.body;
        const filename = `${Date.now()},${imageType}`
        const {data,error} = await supabase.storage.from('avatars').createSignedUploadUrl(filename);
        if (error){
            return res.status(500).json({error});
        }
        return res.json({url:data.signedUrl,filename:filename});
    }catch(err){
        res.status(500).json({err});
    }

}