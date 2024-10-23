import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import About from './pages/About';
import AIpage from './pages/AIpage';

function App() {
  return (
    <Router>
      <div>
        <Routes>

          <Route path="/" element={<Home/>}>
          </Route>

          <Route path="/About" element={<About/>}>
          </Route>

          <Route path="/AIpage" element={<AIpage/>}>
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;