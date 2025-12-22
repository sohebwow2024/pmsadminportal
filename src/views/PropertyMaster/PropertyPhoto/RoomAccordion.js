import { React, useState } from "react";
import { useSelector } from "react-redux";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Badge,
  Row,
  Col,
  Button,
  Card,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import axios from "../../../API/axios";
import "./accordion.scss";
import PhotoCarousel from "./PhotoCarousel";

import PhotoUploadModal from "./PhotoUploadModal";
import UploadedPhoto from "./UploadedPhoto";
import { useEffect } from "react";

const RoomAccordion = ({ data, handleFlag }) => {
  console.log("rooooom> ", data);
  const [rooms] = useState(data.rooms);
  console.log("rooms", rooms);

  const [labels, setLabels] = useState(
    data.labels?.split(",")?.map((element) => element.trim())
  );

  const [selctedFilterLabel, setSelctedFilterLabel] = useState("");

  const [newPhoto, setNewPhoto] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [photoGallery, setPhotoGallery] = useState();
  const getUserData = useSelector((state) => state.userManageSlice.userData);
  const { LoginID, Token, PropertyID, CompanyID, HotelName } = getUserData;

  const handlePhotoUpload = () => {
    setNewPhoto(!newPhoto);
  };

  const [labelColor] = useState([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "dark",
  ]);

  const handleClick = (i, photos) => {
    setShowPhotoGallery(true);
    setPhotoGallery(photos);
    setActiveIndex(i);
  };
  const filterPhoto = (filterLabel) => {
    setSelctedFilterLabel(filterLabel);
    //alert(filterLabel)
  };
  const config = {
    headers: {
      "Content-Type": "application/json",
      Token: Token,
      LoginID: LoginID,
    },
  };

  const [selRoomId, setSelRoomId] = useState("");
  console.log("selRoomId", selRoomId);
  const [selRoomLabel, setSelRoomLabel] = useState("");
  const [selRoomType, setSelRoomType] = useState("");
  const [photos, setPhotos] = useState();

  const [rflag, setRflag] = useState(false);
  const handleRflag = () => setRflag(!rflag);

  const getPhotosbyRoomID = (id) => {
    
    console.log("hit", id);
    // axios.get(`/property/photo/room?RoomID=${id === (undefined || null) ? rid : id}&PropertyID=${PropertyID}`, config).then(res => {
    axios
      .get(`/property/photo/room?RoomID=${id}&PropertyID=${PropertyID}`, config)
      .then((res) => {
        if (res != null) {
          setPhotos(res.data[0]);
        }
      });
  };

  useEffect(() => {
    getPhotosbyRoomID(selRoomId);
  }, [rflag]);

  return (
    <>
      {rooms ? (
        rooms.map((room, i) => {
          console.log("room", room);
          const [allLabels] = useState(room.labels);
          const [isClicked, setIsClicked] = useState(-1);
          // console.log('roomId', roomId);
          // console.log('photos__', photos)
          //const getPhotosbyRoomID_no_need = (id) => {
          // console.log('ghgdhgdhgdhjgdgdgfdgind', id);
          // setRoomId(id)
          //axios.get(`/property/photo/room?RoomID=${id}&PropertyID=${PropertyID}`, config).then(res => {
          // console.log('roomphotos', res.data);
          //if (res != null) {
          // setPhotos(res.data[0])
          // res.data[0].map((j, k) => {
          // console.log('response', res.data[0]);
          //   setPhotos(j)
          //   // if (isClicked == 1) {
          //   //   photos.push({ id: k, roomNumber: j.RoomID, filename: url + j.FileURL, labels: j.Tags })
          //   //   setIsClicked(parseInt(id))
          //   // }

          // })
          // }
          //})
          //}
          return (
            <AccordionItem key={`${room.type}_${i}`}>
              <AccordionHeader
                color="white"
                targetId={`room_${i}`}
                onClick={() => {
                  getPhotosbyRoomID(room?.id);
                  setSelRoomId(room?.id);
                }}
              >
                {room?.type?.toLowerCase().includes("room")
                  ? room.type
                  : `${room.type} Room`}
              </AccordionHeader>
              <AccordionBody accordionId={`room_${i}`} className="p-2">
                This is an apportunity for you to showcase your rooms. Add
                amazing photos that detail out how the room looks and what it
                offers. Quality photos help set the right customer expectations.
                Tip: Upload photos for the available tags below and consider
                your work done!
                <Row className="">
                  <Col className="col-12 text-center my-1">
                    <Button
                      color="primary"
                      onClick={() => {
                        handlePhotoUpload();
                        setSelRoomId(room.id);
                        setSelRoomLabel(room.labels);
                        setSelRoomType(room.type);
                      }}
                    >
                      Upload Photo
                    </Button>
                  </Col>

                  <Col className="col-12 align-self-center text-center mb-1">
                    <Badge
                      className={`px-2 me-1 my-50 cursor-pointer ${
                        selctedFilterLabel === ""
                          ? "bg-secondary badge-glow"
                          : ""
                      }`}
                      onClick={() => filterPhoto("")}
                      key={`label_`}
                      color="light-secondary"
                      pill
                    >
                      All
                    </Badge>

                    {labels.map((label, i) => {
                      return (
                        <Badge
                          className={`px-1 me-1 my-50 cursor-pointer ${
                            selctedFilterLabel === label ? "badge-glow" : ""
                          }`}
                          onClick={() => filterPhoto(label)}
                          key={`label_${i}`}
                          color={labelColor[i < 7 ? i : i % 7]}
                          pill
                        >
                          {label}
                        </Badge>
                      );
                    })}
                  </Col>
                </Row>
                <Row>
                  {photos &&
                    photos?.map((img, i) => {
                      // console.log("avat >", img.FileURL)
                      // const [photo, setPhoto] = useState(img.FileURL)
                      // console.log(img.Status);
                      return (
                        img.fileURL !== null &&
                        img.status !== "Inactive" && (
                          <Col
                            lg="3"
                            sm="6"
                            md="4 px-25"
                            key={`photo_${i}`}
                            className={
                              selctedFilterLabel === "" ||
                              img.displayName.includes(selctedFilterLabel)
                                ? `d-block`
                                : `d-none`
                            }
                          >
                            <UploadedPhoto
                              photo={img.fileURL}
                              setPhoto={img.fileURL}
                              isRoom={true}
                              allLabels={img.displayName}
                              photos={photos}
                              data={img}
                              setPhotos={setPhotos}
                              handleFlag={handleFlag}
                              handleRflag={handleRflag}
                              id={selRoomId}
                              getPhotosbyRoomID={getPhotosbyRoomID}
                              onClick={() => handleClick(i, photos)}
                            />
                          </Col>
                        )
                      );
                    })}
                  {/* {photos.map((img, i) => {
                    const [photo, setPhoto] = useState(img)
                    // console.log("avat >", img, photo)
                    return (
                      <Col
                        lg="3"
                        sm="6"
                        md="4 px-25"
                        key={`photo_${photo.id}_${i}`}
                        className={
                          selctedFilterLabel.trim() === "" ||
                            photo.labels.includes(selctedFilterLabel) ? `d-block` : `d-none`
                        }
                      >
                        <UploadedPhoto
                          photo={photo}
                          setPhoto={setPhoto}
                          allLabels={room.labels}
                          photos={photos}
                          setPhotos={setPhotos}
                          onClick={() => handleClick(i, photos)}

                        />
                      </Col>
                    )
                  })} */}
                </Row>
              </AccordionBody>
            </AccordionItem>
          );
        })
      ) : (
        <span>No rooms available</span>
      )}
      {showPhotoGallery ? (
        <Modal
          id="PhotoGalleryModal"
          isOpen={showPhotoGallery}
          className="modal-dialog-centered modal-xl transparent"
        >
          <ModalHeader
            className="bg-transparent p-0"
            toggle={() => {
              setPhotoGallery(null);
              setShowPhotoGallery(false);
            }}
          ></ModalHeader>
          <ModalBody
            className=""
            style={{
              marginTop: `${
                (window.innerHeight - 60 - window.innerHeight * 0.8) / 2
              }px`,
            }}
          >
            <PhotoCarousel
              photos={photoGallery}
              size="50%"
              activeIndex={activeIndex}
            />
          </ModalBody>
        </Modal>
      ) : null}

      {newPhoto && (
        <PhotoUploadModal
          open={newPhoto}
          setNewPhoto={setNewPhoto}
          handlePhotoUpload={handlePhotoUpload}
          isRoom={true}
          allLabels={selRoomLabel}
          roomType={selRoomType}
          id={selRoomId}
          photos={photos}
          setPhotos={setPhotos}
          handleFlag={handleFlag}
          getPhotosbyRoomID={getPhotosbyRoomID}
        />
      )}
    </>
  );
};

export default RoomAccordion;
