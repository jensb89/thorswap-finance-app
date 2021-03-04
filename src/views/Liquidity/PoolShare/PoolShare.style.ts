import { ContentView, Label } from 'components'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const Container = styled(ContentView)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  height: 100%;
  padding: 20px;
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 32px 0;
`

export const SectionData = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  border: 1px solid ${palette('gray', 0)};
  border-radius: 4px;

  margin: 16px 0;
  padding: 16px;
`

export const ShareSection = styled.div`
  display: flex;
  flex-direction: row;
`

export const ShareData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  flex: 1;
`

export const RedemptionSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

export const HeaderLabel = styled(Label).attrs({
  size: 'big',
  weight: 'bold',
})`
  margin-bottom: 8px;
`

export const DataTitle = styled(Label).attrs({
  size: 'big',
})`
  margin-bottom: 8px;
`

export const DataValue = styled(Label).attrs({
  size: 'big',
  weight: 'bold',
})``

export const DataInfo = styled(Label).attrs({
  size: 'normal',
  color: 'gray',
})`
  margin-top: 4px;
`
