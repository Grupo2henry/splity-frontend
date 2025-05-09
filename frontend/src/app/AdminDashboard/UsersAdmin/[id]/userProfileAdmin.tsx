const userProfileAdmin = ({params} : {params : {id : string}})=>{
    const id = params.id;
    try { const res = await fetch(`${process.env.NEXT_PUBLIC_API_UR}/users/${id}`) , { headers: {
        Authorization: `Bearer ${process.env.SERVER_TOKEN}`, // Si necesitás auth
      },
      cache: "no-store", // si querés SSR cada vez}}
   

    return <div></div>}
export default userProfileAdmin
