import { useMemo, type FC } from 'react';
import { STEPS, NEXT_STEP } from './data/steps';
import { AccordionStep } from './components/AccordionStep';
import { ReviewPanel } from './components/ReviewPanel';
import { Toast } from './components/Toast';
import styles from './App.module.scss';

const App: FC = () => {
  const steps = useMemo(() => STEPS, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Let&apos;s get started!</h1>
      </header>

      <main className={styles.layout}>
        <div className={styles.builder}>
          {steps.map((step) => (
            <AccordionStep key={step.id} step={step} nextStepId={NEXT_STEP[step.id]} />
          ))}
        </div>

        <div className={styles.reviewCol}>
          <ReviewPanel />
        </div>
      </main>

      <Toast />
    </div>
  );
};

export default App;
