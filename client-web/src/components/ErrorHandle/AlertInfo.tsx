import React, { FC } from "react";
import { toast } from "react-toastify";
import Alert from "@material-ui/lab/Alert";
import { ResMsg } from "../../services/AuthService";

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

export const AlertInfo: FC<{ type: string; msg: string }> = () => {
  return <Alert severity='info'>This is an info alert — check it out!</Alert>;
};
