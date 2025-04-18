import {
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router';
import Home from './pages/home';

const App: React.FC = () => {

  return (
    <>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
    </>
  )
}

export default App
