import { Routes, Route } from 'react-router-dom';
import Home from './Home';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Home />} />
  </Routes>
);

export default AppRoutes;
