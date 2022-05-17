import Header from './Header';
import MainSection from './MainSection';
import { SpeechRecognitionProvider } from './SpeechRecognitionProvider';

function App() {
  return (
    <>
      <Header />
      <SpeechRecognitionProvider>
        <MainSection />
      </SpeechRecognitionProvider>
    </>
  );
}

export default App;
