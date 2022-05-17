import { useContext, useEffect, useRef, useState } from "react";
import MonacoEditor from './Editor';
import { speechToCodeAdapter } from "./editorConfig";
import { SpeechRecognitionContext } from "./SpeechRecognitionProvider";

export default function MainSection() {
  const SpeechRecongition = useContext(SpeechRecognitionContext);
  const [ code, setCode ] = useState('');
  const editorRef = useRef(null);

  function handleEditorDidMount(editor: any) {
    editorRef.current = editor;
  }

  const handleClick = () => {
    SpeechRecongition.trigger();
  };

  const handleOnChange = (e: string | undefined) => {
    setCode(e || '');
  };

  useEffect(() => {
    // @ts-ignore
    editorRef?.current?.trigger('keyboard', 'type', {text: speechToCodeAdapter[SpeechRecongition.speechMessage] || ''})
    // @ts-ignore
    editorRef?.current?.trigger("editor", "editor.action.formatDocument");
  }, [SpeechRecongition.speechMessage]);

  return (
    <div className="w-full container mx-auto p-6 mnSctn-container">
      <div className="mnSctn-container--body">
        <MonacoEditor
          height="200px"
          onMount={handleEditorDidMount}
          defaultLanguage="typescript"
          value={code}
          onChange={handleOnChange}
          options={{
            autoIndent: true,
          }}
        />
        <p>
          {SpeechRecongition.speechMessage}
        </p>
        <div className="rounded-t-lg overflow-hidden text-center p-4">
          <button className="bg-red-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
            Speak!
          </button>
        </div>
      </div>
    </div>
  )
}
