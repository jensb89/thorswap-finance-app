import { media } from 'helpers/style'
import styled from 'styled-components'
import { palette } from 'styled-theme'

export const BackLinkWrapper = styled.div`
  display: flex;
  width: 200px;
  align-items: center;
  margin-bottom: 10px !important;
  ${media.sm`
    margin-bottom: 20px !important;
  `}

  cursor: pointer;

  svg {
    margin-right: 6px;
    font-size: 22px;
    font-weight: bold;
    color: ${palette('primary', 0)};
  }

  span {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${palette('primary', 0)};
  }
`
