import styled from 'styled-components'
import { palette } from 'styled-theme'

import { media } from 'helpers/style'

import { Label, CoreButton } from '../../UIElements'

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 0 8px;
  ${media.sm`
    padding: 0 20px;
  `}

  margin-top: 10px;

  .ant-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px 0;

  .ant-btn {
    width: 100%;
  }
`

export const FormLabel = styled(Label)`
  margin-bottom: 10px;
`

export const PasswordLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  svg {
    color: ${palette('text', 0)};
    margin-left: 4px;
  }
`

export const PasswordInput = styled.div`
  padding-top: 20px;
`

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  margin-top: 16px;
`

export const FooterContent = styled.div`
  display: flex;
  align-items: center;
`

export const ActionButton = styled(CoreButton)`
  border-radius: 18px;

  div {
    padding-left: 4px;
    padding-right: 4px;
  }
`
