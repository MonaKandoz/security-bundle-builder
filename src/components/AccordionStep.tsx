import { useEffect, useRef, type FC } from 'react';
import gsap from 'gsap';
import type { StepConfig, StepId } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/useAppStore';
import { setOpenStep } from '../store/slices/builderSlice';
import { makeSelectStepSelectedCount, selectOpenStep, selectProductsByStep } from '../store/selectors';
import { ProductCard } from './ProductCard';
import { CameraStepIcon, ShieldStepIcon, SensorStepIcon, ProtectionStepIcon, ChevronIcon } from '../assets/StepIcons';
import styles from './AccordionStep.module.scss';

const ICONS: Record<string, FC> = {
  camera: CameraStepIcon,
  shield: ShieldStepIcon,
  sensor: SensorStepIcon,
  protection: ProtectionStepIcon,
};

interface AccordionStepProps {
  step: StepConfig;
  nextStepId: StepId | null;
}

export const AccordionStep: FC<AccordionStepProps> = ({ step, nextStepId }) => {
  const dispatch = useAppDispatch();
  const openStep = useAppSelector(selectOpenStep);
  const selectedCount = useAppSelector(makeSelectStepSelectedCount(step.id));
  const products = selectProductsByStep(step.id);

  const isOpen = openStep === step.id;
  const Icon = ICONS[step.icon];

  const panelRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const stepRef = useRef<HTMLElement | null>(null);


  useEffect(() => {
  const panel = panelRef.current;
  const inner = innerRef.current;
  if (!panel || !inner) return;

  if (isFirstRender.current) {
    gsap.set(panel, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 });
    isFirstRender.current = false;
    return;
  }

  if (isOpen) {
    const targetHeight = inner.offsetHeight;
    gsap.fromTo(
      panel,
      { height: 0, opacity: 0 },
      {
        height: targetHeight,
        opacity: 1,
        duration: 0.32,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(panel, { height: 'auto' });

          const el = stepRef.current;
          if (!el) return;

          const rect = el.getBoundingClientRect();
          const isAlreadyVisible =
            rect.top >= 0 && rect.top <= window.innerHeight * 0.5;

          if (!isAlreadyVisible) {
            const prefersReducedMotion =
              window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

            el.scrollIntoView({
              block: 'start',
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
            });
          }
        },
      },
    );
  } else {
    const startHeight = panel.offsetHeight;
    gsap.fromTo(
      panel,
      { height: startHeight, opacity: 1 },
      { height: 0, opacity: 0, duration: 0.26, ease: 'power2.in' },
    );
  }
}, [isOpen]);

  const handleHeaderClick = () => {
    dispatch(setOpenStep(step.id));
  };

  const handleNext = () => {
    if (nextStepId) {
      dispatch(setOpenStep(nextStepId));
    }
  };

  return (
    <section
      ref={(node) => {
        stepRef.current = node;
      }}
      className={`${styles.step} ${isOpen ? styles.open : ''}`}
    >

      <button
        type="button"
        className={styles.stepBtn}
        onClick={handleHeaderClick}
        aria-expanded={isOpen}
      >
        <span className={styles.eyebrow}>
          Step {step.stepNumber} of 4
        </span>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>
              <span className={styles.iconWrap}>{Icon && <Icon />}</span>
              {step.title}
            </h2>
          </div>
          <div className={styles.headerRight}>
            {isOpen && (
              <span className={styles.selectedCount}>{selectedCount} selected</span>
            )}
            <ChevronIcon direction={isOpen ? 'up' : 'down'} />
          </div>
        </div>
      </button>

      <div className={styles.panel} ref={panelRef}>
        <div className={styles.panelInner} ref={innerRef}>
          <div className={styles.flex}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {step.ctaLabel && (
            <button type="button" className={styles.nextBtn} onClick={handleNext}>
              {step.ctaLabel}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
