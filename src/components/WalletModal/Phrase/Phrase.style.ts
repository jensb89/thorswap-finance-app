import styled from 'styled-components'
import { palette } from 'styled-theme'

import { Label } from '../../UIElements'

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  margin-top: 40px;

  .ant-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`

export const Content = styled.div`
  flex: 1;
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
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export const FooterContent = styled.div`
  display: flex;
  align-items: center;

  a {
    margin-right: 12px;
    text-decoration: underline;
  }

  .ant-btn {
    margin-left: 10px;
  }
`
