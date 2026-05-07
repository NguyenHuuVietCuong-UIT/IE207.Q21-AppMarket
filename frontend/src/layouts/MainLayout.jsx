import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            {/* Thẻ main sẽ tự dãn ra đẩy Footer xuống đáy trang */}
            <main style={{ flexGrow: 1, padding: '20px' }}>
                {/* Outlet chính là nơi React Router sẽ render nội dung của các trang (Home, AppDetail...) */}
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;