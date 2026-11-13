import React from "react";
import "../css/userPopUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket, } from "@fortawesome/free-solid-svg-icons";
import { handleSucess, handleError } from "../utils/utils";
import { ToastContainer } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Link } from 'react-router-dom';

const UserPopUp = () => {

    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleLogout = async () => {
        try {

            const response = await fetch("http://localhost:3010/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            const result = await response.json();

            if (result.success) {
                handleSucess(result.message);


                setUser(null);


                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }

        } catch (error) {
            console.log(error);
            handleError("Logout failed");
        }
    };

    return (

        <div className="userPopup">
            <Link to={"/console/userprofile"}>
                <button className="popupItem">
                    <FontAwesomeIcon icon={faUser} />
                    <span >Profile</span>
                </button>
            </Link>


            <button className="popupItem logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                <span>Log Out</span>
            </button>
            <ToastContainer />
        </div>
    )
}

export default UserPopUp;