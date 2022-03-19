import { styled } from '@stitches/react';
import { action } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toastful } from 'react-toastful';
import { StyledInput } from '../../components/input';
import { StyledButton } from '../../components/toolbar';
import supabase from '../../lib/client';

const Container = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--color-grey-50)',
});

const Title = styled('h1', {
  margin: '0 0 1rem 0',
  fontSize: 'var(--scale-1)',
  fontFamily: 'var(--font-sans)',
});

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  boxShadow: 'var(--elevation-1)',
  padding: 'var(--size-4)',
  background: 'white',
  border: '1px solid var(--color-grey-100)',
  borderRadius: 'var(--radius-md)',
});

const StyledLink = styled(Link, {
  marginTop: 'var(--size-8)',
  color: 'var(--color-blue)',
  fontFamily: 'var(--font-sans)',
  textDecoration: 'underline',
});

const Error = styled('p', {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--scale-00)',
});

export const Register = observer(() => {
  const navigate = useNavigate();
  const store = useLocalObservable(() => ({
    username: '',
    password: '',
    confirmPassword: '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (store.password !== store.confirmPassword) {
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: store.username,
        password: store.password,
      });
      if (error) {
        toastful.failure(<Error>Failed to register. Try again.</Error>, {
          position: 'bottom',
        });
      } else {
        navigate('/login');
      }
    } catch {}
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>notion-freehand</Title>
        <StyledInput
          placeholder="Email address"
          value={store.username}
          onChange={action((e) => (store.username = e.target.value))}
        />
        <StyledInput
          type="password"
          placeholder="••••••••••"
          value={store.password}
          onChange={action((e) => (store.password = e.target.value))}
        />
        <StyledInput
          type="password"
          placeholder="••••••••••"
          value={store.confirmPassword}
          onChange={action((e) => (store.confirmPassword = e.target.value))}
        />
        <StyledButton type="submit">Sign up</StyledButton>
      </Form>
      <StyledLink to="/login">Already have an account?</StyledLink>
    </Container>
  );
});
