import { FormEvent, useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom'; 
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'


import { Button } from '../components/Button';
import { notifyErrorCode } from '../components/Notifications';
import { Question } from '../components/Question';

import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import '../styles/room.scss';


export function AdminRoom () {
  const navigate = useNavigate()
  const { user } = useAuth();
  const params = useParams();
  const [newQuestion, setNewQuestion] = useState(''); // useState = alterar estado e setar como novo
  const roomId = params.id;

  const { title, questions } = useRoom(roomId as string)

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    navigate('/');
  };

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que...')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  };

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
    
  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === ''){
      return;
    }

    if (!user){
      throw new Error (notifyErrorCode()) 
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnwered: false
    }

    await database.ref(`rooms/${roomId}/questions`).push(question); // cria uma nova arvore no firebase
    
    setNewQuestion('');
  };

  return(
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId as string}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>
            Sala {title}
            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
          </h1>
        </div>
        <div className="question-list">
        {questions.map(question => {
          return(
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}

            >
              {/* <> = fragment, container sem HTML */}
              {!question.isAnswered && (
              <>
                <button
                  type='button'
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                >
                  <img src={checkImg} alt="Marcar Pergunta" />
                </button>
                <button
                  type='button'
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img src={answerImg} alt="Remover Pergunta" />
                </button>
              </>
              )}
              <button
                type='button'
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Responder Pergunta" />
              </button>
            </Question>
          );
        })}
        </div>
      </main>
    </div>
  );
};

