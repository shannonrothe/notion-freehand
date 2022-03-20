import { Popover } from '@headlessui/react';
import { styled } from '@stitches/react';
import { observer, useLocalObservable } from 'mobx-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/use_auth';
import { Status } from '../types';
import { PrimaryButton, SecondaryButton } from './button';
import supabase from '../lib/client';
import { runInAction } from 'mobx';
import { StyledInput } from './input';
import { Text } from './text';

const COLORS = [
  'color-red',
  'color-orange',
  'color-yellow',
  'color-green',
  'color-blue',
  'color-purple',
  'color-black',
];

const ToolbarContainer = styled('div', {
  width: 'var(--size-full)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--size-2)',
  padding: 'var(--scale-1)',
});

const ColorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--size-2)',
});

const ButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--size-2)',
});

const StyledColorButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  userSelect: 'none',
  width: 'var(--size-6)',
  height: 'var(--size-6)',
  borderRadius: 'var(--radius-full)',
  variants: {
    selected: {
      true: {
        outline: '2px solid var(--color-black)',
        outlineOffset: '2px',
      },
    },
  },
});

const ColorButton = ({
  color,
  onClick,
  selected,
}: {
  color: string;
  onClick: (color: string) => void;
  selected: boolean;
}) => {
  const handleClick = () => onClick(color);

  return (
    <StyledColorButton
      css={{ background: `var(--${color})` }}
      selected={selected}
      onClick={handleClick}
    />
  );
};

const StyledLink = styled('a', {
  display: 'block',
  textDecoration: 'none',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'pre',
  padding: 'var(--size-2) var(--size-3)',
  borderRadius: 'var(--radius-sm)',
  '&:hover': {
    background: 'var(--color-grey-100)',
  },
});

export const Toolbar = observer(
  ({
    color: selectedColor,
    status,
    onPickColor,
    onSave,
    onLogout,
  }: {
    color: string;
    status: Status;
    onPickColor: (color: string) => void;
    onLogout: () => void;
    onSave: () => void;
  }) => {
    const user = useAuth();
    const store = useLocalObservable<{
      query: string;
      drawings: { id: string; name: string }[];
    }>(() => ({
      query: '',
      drawings: [],
    }));
    const filteredDrawings =
      store.query.length > 0
        ? store.drawings.filter((drawing) => drawing.name.includes(store.query))
        : store.drawings;
    const disabled = status === Status.SAVING || status === Status.SAVED;

    useEffect(() => {
      if (!user) return;
      supabase
        .from('drawings')
        .select('id,name')
        .eq('user_id', user.id)
        .then((resp) => {
          if (!resp.error) {
            runInAction(() => (store.drawings = resp.data));
          }
        });
    }, []);

    return (
      <ToolbarContainer>
        <ColorContainer>
          {COLORS.map((color) => (
            <ColorButton
              key={color}
              selected={color === selectedColor}
              color={color}
              onClick={onPickColor}
            />
          ))}
        </ColorContainer>
        <ButtonContainer>
          <PrimaryButton isDisabled={disabled} onClick={onSave}>
            Save
          </PrimaryButton>
          <Popover as="div" style={{ position: 'relative' }}>
            <Popover.Button
              as={SecondaryButton}
              isDisabled={store.drawings.length === 0}
            >
              View all drawings
            </Popover.Button>
            <Popover.Panel
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translate(-57%, -100%)',
                top: 'calc(-1 * var(--size-4))',
                padding: 'var(--size-2)',
                maxHeight: 'var(--size-72)',
                width: 'var(--size-56)',
                overflow: 'auto',
                boxShadow: 'var(--elevation-1)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-grey-100)',
                background: 'white',
              }}
            >
              <StyledInput
                placeholder="Drawing name"
                onKeyDown={(e) => e.stopPropagation()}
                css={{ marginBottom: 'var(--size-2)' }}
                value={store.query}
                onChange={(e) =>
                  runInAction(() => (store.query = e.target.value))
                }
              />
              {filteredDrawings.length === 0 && (
                <Text align="center" variant="body">
                  No drawings found with query "{store.query}"
                </Text>
              )}
              {filteredDrawings.map((drawing) => (
                <StyledLink
                  key={`${drawing.id}-${drawing.name}`}
                  href={`/?name=${drawing.name}`}
                >
                  <Text variant="body">{drawing.name}</Text>
                </StyledLink>
              ))}
            </Popover.Panel>
          </Popover>
          <SecondaryButton onClick={onLogout}>Log out</SecondaryButton>
        </ButtonContainer>
      </ToolbarContainer>
    );
  }
);
