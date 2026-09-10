import toast from "react-hot-toast";

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        duration: 2500,
        position: 'top-center'
    })
}

export const showErrorToast = (message: string) => {
    toast.error(message, {
        duration: 2500,
        position: 'top-center'
    })
}