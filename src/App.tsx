import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/layout/Header";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
