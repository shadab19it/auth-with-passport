import React from "react";
import { toast } from "react-toastify";

export const AlertToast = (msg: string) => {
  toast.info(<h3 style={{ marginLeft: "10px" }}>{msg}</h3>, {
    position: "top-center",
    hideProgressBar: true,
    autoClose: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
