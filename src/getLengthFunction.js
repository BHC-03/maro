import { useEffect } from "react";

export default function useLength(atom){
    let number;
    useEffect(()=>{
        if(atom){
            atom.map(post=>{
                number =  number+1
                return post
            })
        }
        return number
    },[atom])
}