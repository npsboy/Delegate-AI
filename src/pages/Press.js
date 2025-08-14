import React, { useState } from 'react';
import './Press.css';
import Sidebar from '../components/Sidebar';
import {send_to_gpt} from "../services/BackendServices";
import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../components/UserContext'; 

function Press() {

  const [questions, setQuestions] = useState([
    {
      question: "What is your country’s stance on the crisis in Yemen?",
      answer: "We are deeply concerned by the humanitarian crisis in Yemen and call for increased international aid and cooperation."
    },
    {
      question: "How does Israel justify its stance on nuclear ambiguity in the Middle East?",
      answer: "Israel maintains a policy of nuclear ambiguity as a strategic deterrent in a volatile region, without officially confirming or denying possession of nuclear weapons."
    },
    {
      question: "What is Israel's view on Iran’s missile and nuclear program?",
      answer: "Israel considers Iran’s missile and nuclear program a major threat to regional security and calls for stronger international inspections and deterrents."
    }
  ]);

  const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);


  const [current_Question, setCurrentQuestion] = useState(-1); // -1 used instead of false

  function toggleQuestion(index) {
    if (current_Question === index) {
      setCurrentQuestion(-1);
    } else {
      setCurrentQuestion(index);
    }
  }

  async function get_questions(){
    let format = [
      {
        question: "",
        answer: ""
      }
    ]
    let prompt = `I am the delegate of ${Delegation}. My agenda is ${Agenda}. My committee is ${Committee}. 
      Give me 3 challenging press questions. Use simple. short and direct language. Dig up controversies. format: ${JSON.stringify(format)}`;
    let response = await send_to_gpt(prompt);
    let data = JSON.parse(response);
    alert(data);
    setQuestions(data);
  }

  useEffect(() => {
    get_questions();
  }, []);

  return (
    <div className="press-body">
      <Sidebar/>
      <div className='press'>
        <h1>Press Questions</h1>

        <div id="q_container">

            {questions.map((q_set, index) => (
              <div className='Q_box'>
                <p className='Question'>{q_set.question}</p>
                {current_Question === index && (
                  <>
                    <p className='Answer'>{q_set.answer}</p>
                    <button onClick={() => toggleQuestion(index)}>-</button>
                  </>
                )}
                {current_Question != index && (
                  <button onClick={() => toggleQuestion(index)}>+</button>
                )}
                <hr/>
              </div>
            ))}
          
        </div>

      </div>
    </div>
  )


}

export default Press;