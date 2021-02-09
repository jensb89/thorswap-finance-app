import React, { useRef } from 'react'

import { SliderSingleProps } from 'antd/lib/slider'

import { SliderWrapper, SliderLabel } from './Slider.style'

export type Props = SliderSingleProps & {
  withLabel?: boolean
}

const Slider = (props: Props) => {
  const { withLabel = false, ...otherProps } = props

  const sliderRef = useRef<HTMLElement>(null)

  const handleAfterChange = () => {
    if (sliderRef.current) {
      sliderRef.current.blur()
    }
  }

  return (
    <>
      <SliderWrapper
        onAfterChange={handleAfterChange}
        ref={sliderRef}
        {...otherProps}
      />
      {withLabel && (
        <SliderLabel>
          <span>0%</span>
          <span>100%</span>
        </SliderLabel>
      )}
    </>
  )
}

export default Slider
