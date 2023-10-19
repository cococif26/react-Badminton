import Swal from 'sweetalert2';

export const loadingShow = () => {
  Swal.fire({
    html: '<b style="color:white">Mohon tunggu . . .</b>',
    showConfirmButton: false, allowOutsideClick: false, allowEscapeKey:false,
    background: 'transparent'
  });
}

export const loadingClose = () => Swal.close();

export const msgAlertSuccess = (msg="", dTimeOut=3000) => {
  Swal.fire({
    icon: 'success', title: "Success!", html: msg,
    showConfirmButton: false, allowOutsideClick: false,
    allowEscapeKey:false, timer: dTimeOut,
  });
}

export const msgAlertWarning = (msg="") => {
  Swal.fire({
    title: 'Oops!',
    html: msg,
    icon: 'warning',
    confirmButtonText: 'Oke'
  })
}