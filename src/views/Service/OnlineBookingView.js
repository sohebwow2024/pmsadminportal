
import { data } from 'jquery'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import { Button } from 'reactstrap'
import axios from '../../API/axios'
import { setInvoiceID, } from '../../redux/voucherSlice'
import { store } from '@store/store'
import { useParams } from 'react-router-dom'
import './onlinebooking.scss'
import { Clipboard } from 'react-feather'
// const moment = require('moment')

const OnlineBookingView = () => {
    const { id } = useParams()
    // console.log(id);
    const [data, setData] = useState([])
    // console.log(data[0][0].booking_json);
    // console.log('booking', booking_json);
    const getUserData = useSelector((state) => state.userManageSlice.userData);
    const { LoginID, Token } = getUserData;
    const getBookingData = async () => {
        try {
            const res = await axios.get(`booking/GetReservationFromSTAAH/${id}`, {
                headers: {
                    LoginID,
                    Token,
                }
            })
            setData(res?.data)
            console.log('res', res.data)
            console.log('reservation', res.data[0][0]?.booking_json?.reservations);
            JSONToHTMLTable(res.data[0] && JSON.parse(res.data[0][0]?.booking_json)?.reservations, "tblBooking");

        } catch (error) {
            console.log("Error", error);
        }
    };
    useEffect(() => {
        getBookingData()
    }, [])

    // const booking_json = data[0] && data[0][0]?.booking_json

    // dynamic table
    // const loadCall = JSONToHTMLTable(data[0] && data[0][0]?.booking_json, "tblBooking");
    const copyIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="ms-25" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>'
    function JSONToHTMLTable(jsonData, elementToBind) {
        console.log(jsonData);
        //This Code gets all columns for header   and stored in array col
        var col = [];
        for (var i = 0; i < jsonData.length; i++) {
            for (var key in jsonData[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        //This Code creates HTML table
        var table = document.createElement("table");

        //This Code getsrows for header creader above.
        var tr;//= table.insertRow(-1); // FOr normal table

        // For normal table
        // for (var i = 0; i < col.length; i++) {
        //     var th = document.createElement("th");
        //     th.innerHTML = col[i];
        //     tr.appendChild(th);
        // }

        //This Code adds data to table as rows
        for (var i = 0; i < jsonData.length; i++) {

            for (var j = 0; j < col.length; j++) {
                // console.log(j);
                // for virtical table - start

                tr = table.insertRow(-1);
                var th = document.createElement("th");
                th.innerHTML = col[j];
                tr.appendChild(th);
                // for virtical table - end

                var tabCell = tr.insertCell(-1);
                var dtm = jsonData[i][col[j]];
                // console.log("O Data > ", dtm);

                var dtmSTring = JSON.stringify(dtm).trim();

                if (dtmSTring.startsWith("{")) {
                    dtmSTring = "[" + dtmSTring + "]"
                    dtm = JSON.parse(dtmSTring);
                }
                // console.log("Data > ", dtm);
                // console.log(j + "<Data String> ", JSON.stringify(dtm));

                if (dtmSTring.startsWith("[")) {

                    var isStringArray = dtmSTring.replace("[", "").trim().startsWith("\"");
                    var isNumberArray = !dtmSTring.replace("[", "").trim().includes("\"");
                    var tab = "<table>"
                    if (isStringArray || isNumberArray) {

                        dtm.forEach(element => {
                            // var copy = <Clipboard size={15} />
                            // console.log('hghj', element);
                            tab += "<tr><td>" + element + "<span onClick=\"navigator.clipboard.writeText(\'" + value.trim() + "\')\" style='cursor:pointer'>" + copyIcon + '</span>' + "</td></tr>"
                        });
                        tab += "</table>"

                        // console.log("tab", tab);

                        tabCell.innerHTML = tab;

                    } else {
                        //tabCell.innerHTML = "<div style='color:red;'>"+JSON.stringify(dtm)+"</div>"
                        tabCell.appendChild(JSONToHTMLTable(dtm, null))
                    }
                } else {
                    const value = jsonData[i][col[j]]
                    tabCell.innerHTML = value + (value === '' ? '' : "<span onClick=\"navigator.clipboard.writeText(\'" + value.trim() + "\')\" style='cursor:pointer'>" + copyIcon + '</span>');
                }
            }
        }

        //This Code gets the all columns for header
        if (elementToBind == null) {
            return table;
        }
        var divContainer = document.getElementById(elementToBind);
        divContainer.innerHTML = "&nbsp;";
        divContainer.appendChild(table);
    }

    // const loadMyScript = () => window.addEventListener('load', () => loadCall());

    // useEffect(() => {
    //     loadMyScript()
    // }, [])

    return (
        <>
            <div id='tblBooking'>
            </div>
            {/* <span onClick={copy}>copy</span> */}
        </>



        // <div className=' m-5 border'>
        //     <div className='px-2'>
        //         {data[1]?.map((r, i) => {
        //             return (
        //                 <div key={i}>
        //                     <h3>{r.first_name} {r.last_name}</h3>
        //                     <p>Phone No: {r.telephone}</p>
        //                     <p>Email: {r.email}</p>
        //                     <p>Address: {r.address}</p>
        //                 </div>
        //             )
        //         })}

        //         <table className='table table-bordered'>
        //             <thead>
        //                 <tr>
        //                     <th>Arrival Date</th>
        //                     <th>Departure Date</th>
        //                     <th>Guest Name</th>
        //                     <th>No.of.Adults</th>
        //                     <th>No.of.Children</th>
        //                     <th>No.of.Guests</th>
        //                     <th>Room Stay Status</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {data[2]?.map((r, i) => {
        //                     return (
        //                         <tr key={i}>
        //                             <td >{moment(r.arrival_date).format("DD/MM/YYYY")}</td>
        //                             <td >{moment(r.departure_date).format("DD/MM/YYYY")}</td>
        //                             <td >{r.guest_name}</td>
        //                             <td >{r.numberofadults}</td>
        //                             <td >{r.numberofchildren}</td>
        //                             <td >{r.numberofguests}</td>
        //                             <td >{r.roomstaystatus}</td>
        //                         </tr>
        //                     )

        //                 })}
        //             </tbody>
        //         </table>
        //         <table className='table table-bordered'>
        //             {
        //                 data.length > 0 ? <tbody >
        //                     <tr>
        //                         <td width={'70%'} rowSpan={7}>Notes</td>
        //                         <td width={'15%'}>Subtotal Charges</td>
        //                         <td width={'15%'}>{data[2][0]?.totalbeforetax}</td>
        //                     </tr>
        //                     <tr>
        //                         <td width={'15%'}>Tax</td>
        //                         <td width={'15%'}>{data[2][0]?.totaltax}</td>
        //                     </tr>
        //                     <tr>
        //                         <td width={'15%'}>Total Charges</td>
        //                         <td width={'15%'}>{data[2][0]?.totalprice}</td>
        //                     </tr>
        //                 </tbody> : ''
        //             }
        //         </table>
        //     </div>
        // </div>

    )
}

export default OnlineBookingView
