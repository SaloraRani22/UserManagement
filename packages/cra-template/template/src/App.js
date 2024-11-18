import { Route, Routes   } from "react-router-dom";
import './App.css';
import User from "./components/User";
import UserLayout from './routes/UserLayout'
import Login from "./auth/Login";

function App() {
  return (
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/user-management" element={<UserLayout />}>
      <Route index element={<User />} /> 
    </Route>
  </Routes>
  );
}

export default App;
