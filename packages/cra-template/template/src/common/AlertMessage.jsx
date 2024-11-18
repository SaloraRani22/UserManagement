import Swal from "sweetalert2";
import styles from "./common.module.css";

// basic alert box
const AlertMessage = (
  title = "Default Title",
  icon = "info",
  customOptions = {}, // Optional parameter for extra SweetAlert options
  onConfirm, // Callback function for when the confirm button is clicked
  confirmData = null // Data to pass to the onConfirm callback
) => {
  const { confirmButtonColor} =
    customOptions;
  return Swal.fire({
    title: title,
    icon: icon,
    padding: "0 0 10px 0",
    color: "var(--secondary-text) !important",
    background: "var(--secondary-background) !important",
    customClass: {
      container: styles.swal2CustomContainer, // Custom class name for the container
      confirmButton: !confirmButtonColor
        ? styles.confirmButton
        : styles.confirmButton1, // Custom class for button text color
    },
    didOpen: () => {
      const popup = Swal.getPopup(); // Get the alert box DOM element
      if (popup) {
        popup.style.boxShadow = "0px 5px 15px var(--box-shadow-color)"; // Apply custom box-shadow
      }
    },
    ...customOptions, // Spread other custom options if needed
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      // Call the parent function with the data passed in confirmData
      onConfirm(confirmData);
    }
  });
};
export default AlertMessage;
