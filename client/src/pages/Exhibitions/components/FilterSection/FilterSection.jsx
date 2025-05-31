import styles from './FilterSection.module.css';

export default function FilterSection({ filters, setFilters }) {
  const options = {
    genre: ['장르전체', '복합매체', '추상화', '조각', '초상화', '설치미술', '자연미술', '미디어아트', '건축', '현대미술'],
    sort: ['최신순', '오래된순'],
    status: ['현재전시', '종료전시', '예정전시'],
    region: ['지역전체', '서울', '경기', '인천', '강원', '대전/충청', '대구', '부산/울산', '경상', '광주/전라', '제주'],
  };

  const isLoggedIn = !!localStorage.getItem('ACCESS_TOKEN');

  return (
    <section className={styles.filterSection}>
      {Object.entries(options).map(([key, values]) => (
        <select
          key={key}
          className={styles.filterDropdown}
          value={filters[key]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              [key]: e.target.value,
            }))
          }
        >
          {values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ))}

      {/* ✅ 좋아요 필터 추가 */}
      <label className={styles.likedFilterLabel}>
        <input
          type="checkbox"
          checked={filters.likedOnly}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              likedOnly: e.target.checked,
            }))
          }
          disabled={!isLoggedIn}
        />
        좋아요만 보기
      </label>
    </section>
  );
}
