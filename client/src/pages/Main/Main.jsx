import ChatbotWidget from '../../components/common/ChatbotWidget/ChatbotWidget';
import Footer from '../../components/common/Footer/Footer';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import styles from './Main.module.css';

export default function Main() {
  return (
    <div className={styles.layout}>
      <h1>아뜰리 Header</h1>
      <SearchBar />
      <br />
      메인페이지입니다.
      <br />
      <br />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
