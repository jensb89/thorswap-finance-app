import { Label, ContentView } from 'components'
import styled from 'styled-components/macro'

export const Container = styled(ContentView)`
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;
`

export const ContentPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin: 24px 0;
`

export const PoolSelect = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin: 24px 0;
`

export const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px 0;
`

export const FormLabel = styled(Label).attrs({
  weight: 'bold',
})`
  margin-bottom: 8px;
`

export const DragContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 14px;
`

export const ConfirmModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`

export const MemoTypes = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 130px;
`