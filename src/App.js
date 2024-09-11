import {useEffect, useState} from 'react';
import './App.css';
import { getFactOrFiction } from './prompt';

function App() {
  const [prompt, setPrompt] = useState(null);
  const [type, setType] = useState('');
  const [score, setScore] = useState(0);

  useEffect (() => {
    const initialPrompt = async() => {
      try {
        await generatePrompt();
      }
      catch (error) {
        console.log(error);
      }
    }
    initialPrompt();
  }, []);

  const handleFact = async() => {  
    await generatePrompt();  
    if (type === 'fact') {
      setScore(score + 1);      
    }
    else {
      setScore(0);
    }    
  }

  const handleFiction = async() => {
    await generatePrompt();
    if (type === 'fiction') {
      setScore(score + 1);      
    }
    else {
      setScore(0);
    }
  }

  const generatePrompt = async() => {
    const output = await getFactOrFiction();
    if (output) {
      setPrompt(output.statement);
      setType(output.type);
    }
    else {
      console.log('Error getting prompt');
    }
  }

  return (
    <div className="container">
      <div className="title">
        <h1 className="title_text">Fact or Fiction!</h1>
      </div>
      <div className="prompt">
        <p className="prompt_text">{prompt}</p>
      </div>
      <div className='choices'>        
          <button onClick={handleFact}>Fact</button>                
          <button onClick={handleFiction}>Fiction</button>        
      </div>
      <div className='score'>
        <p>Score: {score}</p>
      </div>
    </div>
  );
}

export default App;
