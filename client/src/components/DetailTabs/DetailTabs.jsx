import styles from './DetailTabs.module.css';

export default function DetailTabs({
  tabs,
  activeTab,
  setActiveTab,
  children,
}) {
  return (
    <div className={styles.tabsLayout}>
      <nav className={styles.tabNav}>
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.tabButton} ${activeTab === key && styles.activeTab}`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className={styles.tabContent}>{children}</section>
    </div>
  );
}
