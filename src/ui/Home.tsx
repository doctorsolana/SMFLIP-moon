import React from 'react';
import { Button } from '../components/Button';
import { Section } from '../components/Section';
import { Icon } from '../components/Icon';
import styles from './Home.module.css';
import { useNavigate } from 'react-router-dom';




export function Home() {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/flip');
  };

  return (
    <div className={styles.banner}>
      <Section>
        <img src="logo.png" alt="Logo" style={{ maxWidth: '200px', margin: '0 auto' }} />
        <p >
          A on-chain, provably-fair app built on Gamba.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', margin: '0 auto' }}>
        <Button
          as="a"
          color="white" 
          onClick={handlePlayClick}
          icon={<Icon.ExternalLink />}
        >
          Play
        </Button>

        </div>
      </Section>
    </div>
  );
}
