import { styled } from '@stitches/react';
import { action, runInAction } from 'mobx';
import { useLocalObservable } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../components/button';
import { StyledInput } from '../../components/input';
import { userStore } from '../../components/protected_route';
import supabase from '../../lib/client';

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  background: 'var(--color-grey-50)',
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

const Title = styled('h1', {
  margin: '0 0 1rem 0',
  fontSize: 'var(--scale-1)',
  fontFamily: 'var(--font-sans)',
});

const StyledLink = styled(Link, {
  marginTop: 'var(--size-8)',
  color: 'var(--color-blue)',
  fontFamily: 'var(--font-sans)',
  textDecoration: 'underline',
});

export const Login = observer(() => {
  const navigate = useNavigate();
  const store = useLocalObservable(() => ({
    username: '',
    password: '',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resp = await supabase.auth.signIn({
        email: store.username,
        password: store.password,
      });
      if (resp.user && resp.session) {
        runInAction(() => {
          userStore.user = resp.user;
        });
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('return');
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          navigate('/');
        }
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
          placeholder="??????????????????????????????"
          value={store.password}
          onChange={action((e) => (store.password = e.target.value))}
        />
        <PrimaryButton type="submit">Log in</PrimaryButton>
      </Form>
      <StyledLink to="/register">Don't have an account?</StyledLink>
    </Container>
  );
});
