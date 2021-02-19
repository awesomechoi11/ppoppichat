import { toast } from 'react-toastify';


// so i dont have to config the toasts
export function toastErr(msg) {
    toast.error(msg, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}