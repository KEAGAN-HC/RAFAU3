import React, { useEffect, useState } from "react"

interface Mensaje {
    id: number,
    texto: string,
    remitente: string,
    hora: string
}

const Mensajeria: React.FC = () => {
    const [mensajes, setMensajes] = useState<Mensaje[]>([])
    const [mensajeNuevo, setMensajeNuevo] = useState<string>(``)

    useEffect(() => {
        const generandoMensajes = setInterval(() => {
            const hora = new Date().toLocaleString();
            const nuevoMensaje: Mensaje = {
                    id: Date.now(),
                    texto: `Mensaje enviado a las ${hora}`,
                    remitente: `Anonimo`,
                    hora: hora

            }

            setMensajes((mensajito)=>{
                return [...mensajito,nuevoMensaje]
            })
        },5000)
        console.log(mensajes)
    }, [])

    const enviarMensaje=(event:React.FormEvent)=>{
        event.preventDefault()
        if(mensajeNuevo.trim()){
            

        }
    }

    return (
        <>
        <h1>Mensajeria</h1>

        {
            mensajes.map((mensaje)=>(
                <p>{mensaje.remitente}: {mensaje.texto}</p>
            ))
        }

        <h2>Enviar mensaje</h2>
        <form onSubmit={enviarMensaje}>
            <input type="text" value={mensajeNuevo} 
            onChange={(e)=>setMensajeNuevo(e.target.value)}
            placeholder="Escribe un mensaje"/>
        <button type="submit">Enviar mensaje</button>
        </form>


        </>
    )
}

export default Mensajeria