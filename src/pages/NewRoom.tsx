import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Toaster } from 'react-hot-toast';

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import { Button } from '../components/Button'


import '../styles/auth.scss'

export function NewRoom() {
  const { user } = useAuth(); // autentificador de sala
  const navigate = useNavigate(); // para navegar para uma página
  const [ newRoom, setNewRoom] = useState(''); // para mudar o estado 

  async function handleCreateRoom(e: FormEvent) { // e = evento da função
    e.preventDefault(); // preventDefault = tira a função padrão da propriedade HTML

    if (newRoom.trim() === '') { // toda essa função é para não criarem sala sem ter nada no input
      return;
    }

    const roomRef = database.ref('rooms') // ref = cria uma tabela chamada 'rooms'

    const firebaseRoom = await roomRef.push({ // push = empurra informação pra dentro
      title: newRoom,
      authorId: user?.id,
    })

    navigate(`/rooms/${firebaseRoom.key}`) // key = id da sala
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração perguntas e respostas" />  
        <strong>  Toda pergunta tem uma resposta. </strong>
        <p> Tire as dúvidas da sua audiência</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <h2 className="">Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
          <Toaster />
            <input type="text" 
              name="" 
              id="" 
              placeholder="Nome da sala"
              onChange={e => setNewRoom(e.target.value)}
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}