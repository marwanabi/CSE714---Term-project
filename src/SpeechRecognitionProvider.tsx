import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    webkitSpeechGrammarList: any;
    SpeechRecognition: any;
    SpeechGrammarList: any;
  }
}

const TERMS = [ 'hello', 'hi', 'bye' ];
const GRAMMER = '#JSGF V1.0; grammar terms; public <term> = ' + TERMS.join(' | ') + ' ;'

type RecongitionType = {
  start: () => void
}

type SpeechRecognitionContextType = {
  speechMessage: string,
  trigger: () => void
}
const SpeechRecognitionContext = React.createContext<SpeechRecognitionContextType>({
  speechMessage: '',
  trigger: () => null
});

function SpeechRecognitionProvider({ children }: { children: React.ReactNode }) {
  const [ speechMessage, setSpeechMessage ] = useState('');
  const [ speechRecognitionList, setSpeechRecognitionList ] = useState(null);
  const [ recognition, setRecongition ] = useState<RecongitionType | null>(null);

  useEffect(() => {
    const SGL = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const speechRecognitionList = new SGL();
    speechRecognitionList.addFromString(GRAMMER, 1);

    const SR = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SR();
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setSpeechRecognitionList(speechRecognitionList);
    setRecongition(recognition);

    recognition.onresult = (e: any) => {
      setSpeechMessage(e.results[0][0].transcript);
    };

    recognition.onspeechend = function() {
      recognition.stop();
    }

    recognition.onnomatch = function() {
      console.log("Nothing found!");
    }

    recognition.onerror = function() {
      console.log('something went wrong');
    }
  }, []);

  const trigger = () => {
    console.log('triggering recognition');
    setSpeechMessage('');
    recognition!.start();
  };

  const value = {
    speechMessage,
    trigger
  }

  return (
    <SpeechRecognitionContext.Provider value={value}>
      {children}
    </SpeechRecognitionContext.Provider>
  )
}

export {
  SpeechRecognitionContext,
  SpeechRecognitionProvider
}