import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

function App() {
  const [roomCode, setRoomCode] = useState('')
  const [unido, setUnido] = useState(false)
  const [mensajeActual, setMensajeActual] = useState('')
  const [mensajes, setMensajes] = useState([]) 

  useEffect(() => {

    socket.on('new_message', (data) => {
     
      setMensajes((prev) => [...prev, { ...data, seen: false }])

      if (data.sender_id !== socket.id) {
        socket.emit('mark_seen', { code: data.code, msg_id: data.msg_id })
      }
    })

    socket.on('message_seen', (data) => {
      setMensajes((prev) => 
        prev.map(msg => 
         
          msg.msg_id === data.msg_id ? { ...msg, seen: true } : msg
        )
      )
    })

    return () => {
      socket.off('new_message')
      socket.off('message_seen')
    }
  }, [])

  const unirseAlCanal = () => {
    if (roomCode.length === 6) {
      socket.emit('connect_channel', { code: roomCode })
      setUnido(true)
    } else {
      alert("El código debe ser de 6 dígitos")
    }
  }

  const enviarMensaje = () => {
    if (mensajeActual.trim() !== '') {

      const nuevoMensaje = { 
        code: roomCode, 
        text: mensajeActual,
        msg_id: Date.now().toString(), 
        sender_id: socket.id           
      }
      socket.emit('send_message', nuevoMensaje)
      setMensajeActual('')
    }
  }

  const salirDelCanal = () => {
    socket.emit('leave_channel', { code: roomCode })
    
    setUnido(false)
    setMensajes([])
    setRoomCode('')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Chat Anónimo</h1>

      {!unido ? (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Código de 6 dígitos" 
            maxLength={6}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button onClick={unirseAlCanal}>Unirse al canal</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#555', margin: 0 }}>Canal: {roomCode}</h2>
            <button onClick={salirDelCanal} style={{ padding: '5px 15px', background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Volver al inicio
            </button>
          </div>
          
          <div style={{ height: '400px', border: '1px solid #ccc', padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mensajes.map((msg, index) => {
              const esMio = msg.sender_id === socket.id;

              return (
                <div key={index} style={{ 
                  alignSelf: esMio ? 'flex-end' : 'flex-start',
                  background: esMio ? '#dcf8c6' : '#f0f0f0', 
                  padding: '10px 15px', 
                  borderRadius: '15px',
                  maxWidth: '70%'
                }}>
                  <div style={{ marginBottom: '4px' }}>{msg.text}</div>
                  
                  {esMio && (
                    <div style={{ fontSize: '0.75rem', textAlign: 'right', color: msg.seen ? '#34b7f1' : '#999' }}>
                      {msg.seen ? '✓✓ Visto' : '✓ Enviado'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              style={{ flexGrow: 1, padding: '10px' }}
              type="text" 
              placeholder="Escribe un mensaje..." 
              value={mensajeActual}
              onChange={(e) => setMensajeActual(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
            />
            <button onClick={enviarMensaje} style={{ padding: '10px 20px' }}>Enviar</button>
          </div>
          
        </div>
      )}
    </div>
  )
}

export default App