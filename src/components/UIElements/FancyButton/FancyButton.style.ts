import styled from 'styled-components'
import { palette } from 'styled-theme'

import { FancyButtonProps } from './types'

export const StyledButton = styled.button<FancyButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: ${(props) => (props.size === 'normal' ? '1.2rem' : '0.8rem')};
  letter-spacing: 2px;
  font-weight: 600;
  color: white;
  text-align: center;
  min-width: 50px;
  width: 100%;
  height: ${(props) => (props.size === 'normal' ? '56px' : '32px')};
  border-radius: ${(props) => (props.size === 'normal' ? '28px' : '16px')};

  position: relative;
  overflow: hidden;

  background-size: 400% 400%;
  animation: TransitioningBackground 10s ease infinite;

  background-image: ${(props) =>
    props.disabled
      ? palette('background', 3)
      : !props.error
      ? 'linear-gradient(to left, #23dcc8, #00ccff, #23dcc8)'
      : 'linear-gradient(to left, rgb(245, 55, 195), #00ccff, rgb(245, 55, 195))'};

  border: none;
  padding: ${(props) => (props.size === 'normal' ? '24px' : '10px')};
  width: 220px;
  text-transform: uppercase;
  cursor: ${(props) => (!props.disabled ? 'pointer' : 'not-allowed')};
  color: #fff;
  background-size: 200%;
  transition: 0.3s;

  outline: none;

  // psuedo-element shine animation left side
  &::before {
    content: '';
    display: block;
    position: absolute;
    background: rgba(255, 255, 255, 0.5);
    width: 60px;
    height: 100%;
    top: 0;
    left: -30px;
    filter: blur(30px);
    transform: translateX(-100px) skewX(-30deg);
  }

  // psuedo-element shine animation right side
  &::after {
    content: '';
    display: block;
    position: absolute;
    background: rgba(255, 255, 255, 0.2);
    width: 30px;
    height: 100%;
    top: 0;
    left: -30px;
    filter: blur(5px);
    transform: translateX(-100px) skewX(-30deg);
  }

  // grow button and change background gradient on hover
  &:active,
  &:hover {
    // psuedo-elements for right- and left-side shine animations
    &::before,
    &::after {
      transform: translateX(420px) skewX(-15deg);
      transition: 0.5s;
    }
  }
`
