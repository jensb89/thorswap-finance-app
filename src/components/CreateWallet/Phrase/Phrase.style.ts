import { Label } from 'components'
import styled from 'styled-components'
import { palette } from 'styled-theme'

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
`

export const Generate = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  .ant-btn {
    height: 20px;
    width: 20px;
    padding: 4px 4px;
    margin-left: 8px;
    margin-right: 8px;

    svg {
      display: flex;
      font-size: 12px;
    }
  }
`

export const PhraseContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 300px;
  border: 1px solid ${palette('gray', 0)};
`

export const PhraseWord = styled.div`
  display: flex;
  align-items: center;

  margin: 4px 6px;
  padding: 4px 4px;
  background-color: ${palette('gray', 0)};
`
