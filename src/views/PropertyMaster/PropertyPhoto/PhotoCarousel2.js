import React, { useState } from 'react'
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Badge
} from 'reactstrap'

const labelColor = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "dark"  
]

const PhotoCarousel2 = (props) => {
  const [activeIndex, setActiveIndex] = useState(props.activeIndex)
  const [animating, setAnimating] = useState(false)
  const [items] = useState(props.photos)

  const next = () => {
    if (animating) return
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1

    setActiveIndex(nextIndex)
  }

  const previous = () => {
    if (animating) return
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1

    setActiveIndex(nextIndex)
  }

  const goToIndex = (newIndex) => {
    if (animating) return
    setActiveIndex(newIndex)
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}
        className="text-center"

      >
        <h4 className='text-light mb-25'>{item.roomNumber}</h4>
        <img src={item.src} alt={item.roomNumber} style={window.innerWidth > window.innerHeight ? {height: 0.8 * window.innerHeight} : {width: 0.8 * window.innerWidth}}/>
        <div className='mt-25'>{
                    item.labels.split(',').map((label, i) => {
                    return (
                            <Badge key={`gal_label_${i}`} className={`px-75 me-25 mb-25 cursor-default`} color={labelColor[i < 7 ? i : i % 7]} pill>{label.trim()}</Badge>
                        ) 
                    })
                }
        </div>
        <CarouselCaption/>

      </CarouselItem>
    )
  })

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
    >
      <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  )
}

export default PhotoCarousel2