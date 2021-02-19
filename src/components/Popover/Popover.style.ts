import { InfoCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components/macro'
import { palette } from 'styled-theme'

export const PopoverContent = styled.div`
  width: 300px;
  font-size: '11px';
  color: ${palette('text', 0)};
`

export const TooltipContent = styled.div`
  font-size: '12px';
  color: ${palette('text', 0)};

  z-index: 99999;
`

export const PopoverIcon = styled(InfoCircleOutlined)`
  color: ${palette('error', 0)};
  margin: 0 10px;
`
