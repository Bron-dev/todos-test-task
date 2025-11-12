import styles from './EmptyBox.module.scss';

export const EmptyBox = () => {
  return (
    <div className={styles.emptyBox}>
      <h2>
        There are no tasks yet, start using this app by creating a column or a task, it's your app,
        you decide:)
      </h2>
    </div>
  );
};
