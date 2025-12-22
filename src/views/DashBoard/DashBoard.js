import React, { useEffect, useState } from "react";
import {
	Card,
	Row,
	Col,
	Badge,
	Button,
} from "reactstrap";
import { Calendar, Circle, Monitor, UserCheck, Mail, User } from "react-feather";
import { Chart as ChartJS, registerables } from "chart.js";
import CardDetail from "./CardDetail";
import { storeBookingDetails } from "../../redux/voucherSlice";
import axios from "../../API/axios";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import BookingModal from "../FrontDesk/BookingModal";
import OnHoldQuickBookingModal from '../FrontDesk/OnHoldQuickBookingModal'
import toast from "react-hot-toast";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@components/avatar'
import HotelSelectModal from "./HotelSelectModal";
import '../../assets/scss/style.scss';
import { Modal, ModalHeader, ModalBody } from 'reactstrap'
import Select from 'react-select'


ChartJS.register(...registerables);
const DashBoard = () => {

	useEffect(() => {
		const prevTitle = document.title
		document.title = "PMS-Dashboard"

		return () => {
			document.title = prevTitle
		}
	}, [])


	const [isModalOpen, setIsModalOpen] = useState(false);
	const toggleModal = () => setIsModalOpen(!isModalOpen);
	useEffect(() => {
		setIsModalOpen(true);
	}, []);


	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const toggleNewModal = () => setIsNewModalOpen(!isNewModalOpen);

	const [cardData, setCardData] = useState([]);
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);
	const [refresh, setRefresh] = useState(false);
	const [roomData, setRoomData] = useState([]);
	const [sel_bookingID, setSel_bookingID] = useState('')
	const [remaining, setRemaining] = useState('')
	const getUserData = useSelector((state) => state.userManageSlice.userData);
	const { LoginID, Token, CompanyID, PropertyID } = getUserData;

	const [dailyNumData, setDailyNumData] = useState([]);
	const handleOpen = () => setOpen(!open)
	const handleOnHoldOpne = () => setOnHoldOpen(!onHoldOpen)
	const [onHoldOpen, setOnHoldOpen] = useState(false)
	const [bookingStatus, setBookingStatus] = useState('')
	console.log('bookingStatus', bookingStatus);

	const [hotelSelectOpen, setHotelSelectOpen] = useState(false);
	const handleHotelSelectOpen = () => setHotelSelectOpen(!hotelSelectOpen)

	const dispatch = useDispatch();
	const getNumData = async () => {
		try {
			const objc1 = {
				LoginID,
				Token,
				Seckey: "abc",
				Event: "chart",
			};
			const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
			console.log("numres", res);
			setDailyNumData(res.data);
			setRemaining(res.data[0])
		} catch (error) {
			console.log("Error", error);
		}
	};
	const getRemainingCheckout = async () => {
		try {
			const objc1 = {
				LoginID,
				Token,
				Seckey: "abc",
				Event: "Remaining Checkout",
			};
			const res = await axios.post("getdata/bookingdata/dashboardchart", objc1);
			console.log("remres", res);
			console.log("remres", res.data[0]);
			setRemaining(res.data[0])
		} catch (error) {
			console.log("Error", error);
		}
	};
	useEffect(() => {
		getNumData();
		getRemainingCheckout()
	}, []);
	// console.log("dailyNumData", dailyNumData);

	const getRooms = (i) => {
		// console.log("data i > ", data[i]); // TODO - getroom data for the selected reservation
		try {
			const bookingsBody = {
				LoginID,
				Token,
				Seckey: "abc",
			};
			axios
				.post(`/getdata/bookingdata/dashboardchart`, bookingsBody)
				.then((response) => {
					// console.log("Bookings room num response", response?.data[0]);
					// console.log("123qqq");
					setRoomData(response?.data[0]);
				});
		} catch (error) {
			console.log("123qqq2222");
			console.log("Bookings Error=====", error.message);
		}
	};

	// const handleOpen = (row, i) => {
	//   console.log("data i >", data[i]);
	//   dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.BookingID }));
	//   getRooms(i);
	//   setOpen(!open);
	// };

	useEffect(() => {
		try {
			const bookingsBody = {
				LoginID,
				Token,
				Seckey: "abc",
				// CheckInDate: checkInDate,
				Event: "chart",
				// CheckOutDate: checkInDateP
			};
			axios
				.post(`getdata/bookingdata/dashboardchart`, bookingsBody)
				.then((response) => {
					console.log("res111", response?.data[0]);
					if (response.status === 200) {
						// console.log(
						//   "express Bookings room chart response",
						//   response?.data[0]
						// );
						setData(response?.data[0]);
						// console.log("res", response);
					}
				})
				.catch(function (error) {
					console.log("Bookings Error=====", error?.response?.data?.Message);
				});
		} catch (error) {
			console.log("Bookings Error=====", error);
			toast.error("Something went wrong, Try again!");
		}
		if (data === []) {
			setRefresh(true);
		}
	}, [refresh]);

	const columns = [
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer ' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }))
					if (row.Status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}

					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						// className="text-align-center" 
						title="Click to Manage Booking"
						color="success"
					//  icon={<User color='#FFFFFF' size={25} />}
					//  color={
					//    row.Status === 'Active' && row.CheckIn ? (
					//      'success'
					//    ) : row.Status === 'Checkout' ? (
					//      'primary'
					//    ) : row.Status === 'Cancelled' ? (
					//      'danger'
					//    ) : row.Status === 'Active' && row.CheckIn === false ? (
					//      'warning'
					//    ) : row.Status === 'OnHold' ? (
					//      'info'
					//    ) : '#000'
					//  }
					>  Create<br />
						Check-in
					</Badge>

				</div>
			)
		},
		{
			name: 'Booking Status',
			minWidth: '12rem',
			center: true,
			sortable: true,
			selector: row => row.status,
			cell: row => {
				return (
					<>
						{
							row.status === 'CheckedIN' ? (
								<Badge color='success'>Checked In</Badge>
							) : row.status === 'CheckedOut' ? (
								<Badge color='primary'>{row.status}</Badge>
							) : row.status === 'Cancelled' ? (
								<Badge color='danger'> {row.status}</Badge>
							) : row.status === 'Reserved' && row.CheckIn === false ? (
								<Badge color='light-warning'>Reserved</Badge>
							) : row.status === 'OnHold' ? (
								<Badge color='light-info'>{row.status}</Badge>
							) : <Badge color='light-secondary'>{row.status}</Badge>
						}
					</>
				)
			}
		},
		{
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},

		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-In",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkInDate).format("LL")}</p>
				</>
			),
		}
	];

	const columns1 = [
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId:row.bookingID }))
					if (row.status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}
					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						title="Click to Manage Booking"
						color="primary"
					>
						Create <br />
						Check-Out
					</Badge>
				</div>
			)
		},
		{
			name: 'Booking Status',
			minWidth: '12rem',
			center: true,
			sortable: true,
			selector: row => row.status,
			cell: row => {
				return (
					<>
						{
							row.status === 'CheckedIN' ? (
								<Badge color='success'>Checked In</Badge>
							) : row.status === 'CheckedOut' ? (
								<Badge color='primary'>{row.status}</Badge>
							) : row.status === 'Cancelled' ? (
								<Badge color='danger'> {row.status}</Badge>
							) : row.status === 'Reserved' && row.checkIn === false ? (
								<Badge color='light-warning'>Reserved</Badge>
							) : row.status === 'OnHold' ? (
								<Badge color='light-info'>{row.status}</Badge>
							) : <Badge color='light-secondary'>{row.status}</Badge>
						}
					</>
				)
			}
		},
		{
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},
		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-Out",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkOutDate).format("LL")}</p>
				</>
			),
		},
	];
	const remainingColumns = [
		// console.log('row', row),
		{
			center: true,
			width: '80px',
			sortable: row => row.guestName,
			cell: (row, i) => (
				<div className='d-flex align-items-center cursor-pointer' onClick={() => {
					setSel_bookingID(row.bookingID);
					setBookingStatus(row.status)
					console.warn("gengarBookingId", row.bookingID)
					dispatch(storeBookingDetails({ LoginID, Token, BookingId: row.bookingID }))
					if (row.status === 'OnHold') {
						handleOnHoldOpne()
					} else handleOpen()
				}}>
					{/* {row.avatar === '' ? (
            <Avatar img={require(`../../assets/images/logo/hostynnist-logo.png`).default} />

          ) : (
            <Avatar color={`light-${states[i]}`} content={row.GuestName.toUpperCase()} initials />
          )} */}
					{/* <Avatar
            title="Click to Manage Booking"
            icon={<User color='#FFFFFF' size={25} />}
            color={
              row.Status === 'Active' && row.CheckIn ? (
                'success'
              ) : row.Status === 'Checkout' ? (
                'primary'
              ) : row.Status === 'Cancelled' ? (
                'danger'
              ) : row.Status === 'Active' && row.CheckIn === false ? (
                'warning'
              ) : row.Status === 'OnHold' ? (
                'info'
              ) : '#000'
            }
          /> */}
					<Badge
						className="m-1 p-15 badge-glow d-flex justify-content-center align-items-center"
						title="Click to Manage Booking"
						color="primary"
					>
						Create <br />
						Check-Out
					</Badge>
				</div>
			)
		},
		{
			name: 'Booking Status',
			minWidth: '12rem',
			center: true,
			sortable: true,
			selector: row => row.status,
			cell: row => {
				return (
					<>
						{
							row.status === 'CheckedIN' ? (
								<Badge color='success'>Checked In</Badge>
							) : row.status === 'CheckedOut' ? (
								<Badge color='primary'>{row.status}</Badge>
							) : row.Status === 'Cancelled' ? (
								<Badge color='danger'> {row.status}</Badge>
							) : row.status === 'Reserved' && row.checkIn === false ? (
								<Badge color='light-warning'>Reserved</Badge>
							) : row.status === 'OnHold' ? (
								<Badge color='light-info'>{row.status}</Badge>
							) : <Badge color='light-secondary'>{row.status}</Badge>
						}
					</>
				)
			}
		},
		{
			name: "Booking ID",
			sortable: true,
			minWidth: "200px",
			selector: (row) => row.bookingID,
		},
		{
			name: "Guest Name",
			sortable: true,
			center: true,
			minWidth: "150px",
			selector: (row) => (
				<>
					<p>{row.guestName}</p>
					<p>{row.guestMobileNumber}</p>
				</>
			),
		},
		{
			name: "Check-Out",
			center: true,
			wrap: true,
			sortable: true,
			minWidth: "130px",
			selector: (row) => (
				<>
					<p>{moment(row.checkOutDate).format("LL")}</p>
				</>
			),
		},
	];


	useEffect(() => {
		if (PropertyID === null) {
			handleHotelSelectOpen()
		}
	}, [])

	const dataFilterOption = [
		// {value:"Today",label:"Today"},
		{ value: "Weekly", label: "Weekly" },
		{ value: "Monthly", label: "Monthly" },
		{ value: "Qurterly", label: "Qurterly" },
		{ value: "Yearly", label: "Yearly" },
	]

	// console.log('dailyNumData', dailyNumData[8], remaining, cardData[0]);
	return (
		<div className="dash_main">
			<Row>
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card">
						<CardDetail
							id="1"
							title="Active Subscriptions"
							dataArr={dailyNumData[0]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.todaysBookings
									? cardData[0]?.todaysBookings
									: ""
							}
						/>
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card">
						<CardDetail
							id="2"
							title="Trial Users"
							dataArr={dailyNumData[1]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.monthlyBookings
									? cardData[0]?.monthlyBookings
									: ""
							}
						/>
					</div>
				</Col>

				{/* Bookings Filter */}
				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card" onClick={toggleNewModal} style={{ cursor: "pointer" }}>
						<div className="card">
							<div className="card-body">
								<div className="d-flex justify-content-between align-items-center">
									<div>
										<p style={{ marginBottom: "0" }} className="card-text"> Expiring Soon</p>
										<h3 className="fw-bolder mb-75"><strong>{remaining.length}</strong></h3>
									</div>

									<div className="avatar avatar-stats p-50 m-0 bg-light-primary">
										<UserCheck size={25} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</Col>


				<Col lg="4" xs="12" sm="4" md="6" xl="3">
					<div className="earnings-card top-card pe-none">
						<CardDetail
							id="6"
							title="Failed Renewals"
							dataArr={dailyNumData[5]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.todaysDepartures
									? cardData[0]?.todaysDepartures
									: ""
							}
						/>
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card pe-none bottom-card">
						<CardDetail
							id="5"
							title="Monthly Recurring Revenue"
							dataArr={dailyNumData[4]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.monthlyEarninngs
									? cardData[0]?.monthlyEarninngs
									: ""
							}
						/>
					</div>
				</Col>
				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card bottom-card">
						<CardDetail
							id="7"
							title="Annual Recurring Revenue"
							dataArr={dailyNumData[8]}
							icon={<UserCheck size={25} />}
						// amount={
						//   cardData && cardData[0]?.CreditPendingAmount
						//     ? cardData[0]?.CreditPendingAmount
						//     : ""
						// }
						/>
					</div>
				</Col>

				<Col lg="4" xs="12" sm="4" md="6" xl="4">
					<div className="earnings-card pe-none bottom-card">
						<CardDetail
							id="4"
							title="Conversion Rate"
							dataArr={dailyNumData[3]}
							icon={<UserCheck size={25} />}
							amount={
								dailyNumData && dailyNumData[0]?.todaysEarnings
									? dailyNumData[0]?.todaysEarnings
									: ""
							}
						/>
					</div>
				</Col>
				{/* <Col xs="12" sm="6" md="6" xl="6">
					<div className="earnings-card">
						<CardDetail
							id="3"
							title="Stayovers"
							dataArr={dailyNumData[2]}
							icon={<UserCheck size={25} />}
							amount={
								cardData && cardData[0]?.stayovers ? cardData[0]?.stayovers : ""
							}
						/>
					</div>
				</Col> */}
			</Row>
			
			<Modal className="NewRemainingcount-modal" isOpen={isNewModalOpen} toggle={toggleNewModal}>
				<ModalHeader className='bg-transparent border-bottom' toggle={() => setIsNewModalOpen(!isNewModalOpen)}>
					<div className="BookingsDetails">
					<p>All Bookings Details</p>

					<div className='ms-auto mr-0' style={{ minWidth: 200 }}>
						{/* <Label className='form-check-label'>Filter</Label> */}
						<Select
							className='react-select'
							classNamePrefix='select'
							placeholder="Filter"
							options={dataFilterOption}
						/>
					</div>
					</div>
				</ModalHeader>
				<ModalBody>
					<DataTable
						noHeader
						columns={remainingColumns}
						paginationPerPage={7}
						className="react-dataTable"
						sortIcon={<ChevronDown size={10} />}
						data={remaining}
					/>
				</ModalBody>
				<div style={{ paddingRight: "9px" }} className='my-50 d-flex justify-content-end'>
					<Button color='primary' onClick={e => { setIsNewModalOpen(!isNewModalOpen) }}>Close</Button>
				</div>

			</Modal>

			
			<HotelSelectModal
				open1={hotelSelectOpen}
				handleOpen1={handleHotelSelectOpen} />
			{open && <BookingModal open={open} handleOpen={handleOpen} bookingID={sel_bookingID} bookingStatus={bookingStatus} />}
			{onHoldOpen && <OnHoldQuickBookingModal open={onHoldOpen} handleOnHoldOpen={handleOnHoldOpne} bookingID={sel_bookingID} />}
		</div>

	);
};

export default DashBoard;
