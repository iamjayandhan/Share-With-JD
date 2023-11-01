import './App.css';
import TextShare from "./TextShare";
import FileShare from "./FileShare";


function App() {

  return (
    <div className="container">
      <div className="row">
        <TextShare />
        <FileShare />
      </div>
    </div>
  );
}

export default App;
