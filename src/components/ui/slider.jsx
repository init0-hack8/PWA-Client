import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import "./slider.css"

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={`slider-root ${className || ''}`}
    {...props}
  >
    <SliderPrimitive.Track className="slider-track">
      <SliderPrimitive.Range className="slider-range" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="slider-thumb" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 