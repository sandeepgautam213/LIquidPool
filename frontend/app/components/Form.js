import styles from "../page.module.css";

const Form = ({ token, onChange, onClick, val }) => {
  return (
    <main className={styles.main}>
      
      <div className={styles.box}>
        <input
          type="number"
          className={styles.input1}
          placeholder="0 RBNT"
          value={token.RBNT}
          onChange={onChange}
        />
        <div className={styles.buttondiv}>
          <input
            type="number"
            className={styles.input2}
            placeholder="0 SANDY"
            value={token.SANDY}
            readOnly
          />
          <div>
            <button
              class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              onClick={token.RBNT && onClick}
              disabled={!token.RBNT}
            >
              {val}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Form;
