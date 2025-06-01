import styles from './Find.module.css';
import InputText from '../../components/Input/InputText/InputText';
import useInput from '../../hooks/useInput';

export default function Find() {
  const { data: idDatas, handleChange: handleLoginChange } = useInput({
    userName: '',
    userEmail: '',
  });
  const { data: passwordDatas, handleChange: handlePasswordChange } = useInput({
    userId: '',
    userEmail: '',
  });

  const handleFindId = (e) => {
    e.preventDefault();

    alert('아이디 찾기 실행');
  };

  const handleFindPassword = (e) => {
    e.preventDefault();

    alert('비밀번호 찾기 실행');
  };

  return (
    <div className={styles.layout}>
      <form className={styles.findForm} onSubmit={handleFindId}>
        <h2 className={styles.formTitle}>아이디 찾기</h2>
        <InputText
          name='userName'
          placeholder='이름'
          onChange={handleLoginChange}
          value={idDatas.userName}
        />
        <InputText
          name='userEmail'
          placeholder='@를 포함한 전체 이메일 주소를 입력해주세요'
          onChange={handleLoginChange}
          value={idDatas.userEmail}
        />
        <button className={styles.submitButton}>아이디 찾기</button>
      </form>
      <form className={styles.findForm} onSubmit={handleFindPassword}>
        <h2 className={styles.formTitle}>비밀번호 찾기</h2>
        <InputText
          name='userId'
          placeholder='아이디'
          onChange={handlePasswordChange}
          value={passwordDatas.userId}
        />
        <InputText
          name='userEmail'
          placeholder='@를 포함한 전체 이메일 주소를 입력해주세요'
          onChange={handlePasswordChange}
          value={passwordDatas.userEmail}
        />
        <button className={styles.submitButton}>임시 비밀번호 발급</button>
      </form>
    </div>
  );
}
