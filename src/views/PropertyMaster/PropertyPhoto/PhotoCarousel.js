import React, { Component } from 'react'
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Badge
} from 'reactstrap'
import { Image_base_uri } from '../../../API/axios'

const labelColor = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "dark"
]
class PhotoCarousel extends Component {

  constructor(props) {
    super(props)
    this.state = { autoPlay: false, activeIndex: props.activeIndex ?? 0, items: props.photos, size: props.photoSize ?? '100%' }
    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.goToIndex = this.goToIndex.bind(this)
    this.onExiting = this.onExiting.bind(this)
    this.onExited = this.onExited.bind(this)

    //console.log(labelColor)
  }

  onExiting() {
    this.animating = true
  }

  onExited() {
    this.animating = false
  }

  next() {
    if (this.animating) return
    const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous() {
    if (this.animating) return
    const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex(newIndex) {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }
  render() {

    const { activeIndex } = this.state
    const { items } = this.state
    //const { size } = this.state

    const slides = items?.map((item) => {
      // console.log('item', item);
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.id}
          className="text-center"
        >
          <h4 className='text-light mb-25'>{item.roomNumber}</h4>
          <img src={item.FileURL ? Image_base_uri + item.FileURL : ''} alt={item.roomNumber} style={window.innerWidth > window.innerHeight ? { height: 0.8 * window.innerHeight } : { width: 0.8 * window.innerWidth }} />
          {/* <div className='mt-25'>{
            item.labels.split(',').map((label, i) => {
              return (
                <Badge key={`gal_label_${i}`} className={`px-75 me-25 mb-25 cursor-default`} color={labelColor[i < 7 ? i : i % 7]} pill>{label.trim()}</Badge>
              )
            })
          }
          </div> */}

        </CarouselItem>
      )
    })

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        slide={true}
      >
        <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
        {slides}
        <CarouselControl direction="prev" directionText="Previous" className='bg-dark' onClickHandler={this.previous} />
        <CarouselControl direction="next" directionText="Next" className='bg-dark' onClickHandler={this.next} />

      </Carousel>
    )
  }
}

export default PhotoCarousel