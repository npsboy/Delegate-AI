import React, { useState } from 'react';
import './Press.css';
import Sidebar from '../components/Sidebar';
import {send_to_gpt} from "../services/BackendServices";
import { useEffect } from 'react';
import { useContext } from 'react';
import UserContext from '../components/UserContext'; 
import LoadingScreen from '../components/LoadingScreen';

function Press() {

  const [questions, setQuestions] = useState([

  ]);

  const {Delegation, setDelegation, Agenda, setAgenda, Committee, setCommittee} = useContext(UserContext);


  const [current_Question, setCurrentQuestion] = useState(-1); // -1 used instead of false

  const [loading, setLoading] = useState(false);

  function toggleQuestion(index) {
    if (current_Question === index) {
      setCurrentQuestion(-1);
    } else {
      setCurrentQuestion(index);
    }
  }

  async function get_questions(){

    if (!Delegation || !Agenda || !Committee) {
      alert("Something went wrong. Please refresh the page and try again.");
      return;
    }

    let question_type = document.querySelector("select").value;

    setLoading(true);

    let format = [
      {
        question: "",
        answer: ""
      }
    ]
    let prompt
    if (question_type == "Agenda") {
      prompt = `I am the delegate of ${Delegation}. My agenda is ${Agenda}. My committee is ${Committee}. 
      Give me 3 challenging press questions. Use simple, short and direct language. Dig up controversies. format: ${JSON.stringify(format)}`;
    }
    else {
      prompt = `I am the delegate of ${Delegation}. My committee is ${Committee}. 
      Give me 3 challenging press questions. Use simple, short and direct language. Dig up controversies. format: ${JSON.stringify(format)}`;
    }
    let response = await send_to_gpt(prompt);
    let data = JSON.parse(response);
    let questions_list = questions
    questions_list.unshift(...data);
    setQuestions(questions_list);
    localStorage.setItem("pressQuestions", JSON.stringify(questions_list));
    setLoading(false);
  }

  useEffect(() => {
    if (localStorage.getItem("pressQuestions")){
      let stored_data = JSON.parse(localStorage.getItem("pressQuestions"))
      setQuestions(stored_data)
    }
    else {
      get_questions();
    }
  }, []);

  return (
    <div className="press-body">
      <Sidebar/>
      {loading && <LoadingScreen label="Loading Press Questions..." />}
      {!loading && <>
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
      <div className='settings'>
        <h2>Get more questions</h2>
        <select>
          <option value="Agenda" selected>Agenda Specific</option>
          <option value="General">General</option>
        </select>
        <button className='generate' onClick={get_questions}>Get New Questions</button>
      </div>

      </>}
      
    </div>
  );


}

export default Press;