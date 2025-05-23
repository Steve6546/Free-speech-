import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
      <Link to="/" style={{ marginRight: '10px' }}>🏠 الرئيسية (Dashboard)</Link> | 
      <Link to="/setup" style={{ marginLeft: '10px' }}>➕ قصة جديدة (New Story)</Link>
    </nav>
  );
}
