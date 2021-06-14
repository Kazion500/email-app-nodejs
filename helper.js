const emailEx =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let dateFormat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
let timeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
let error = {};

module.exports.validateShareInput = (fields) => {
  if (!fields.email || fields.email === "") {
    error["email"] = "E-mail is required";
  }
  if (!fields.recipientEmail || fields.recipientEmail === "") {
    error["recipientEmail"] = "Recipient E-mail is required";
  }
  if (fields.email) {
    if (!emailEx.test(String(fields.email).toLowerCase())) {
      error["email"] = "Enter a valid email";
    }
  }
  if (fields.recipientEmail) {
    if (!emailEx.test(String(fields.recipientEmail).toLowerCase())) {
      error["recipientEmail"] = "Enter a valid email";
    }
  }

  return { errors: error, success: false };
};

module.exports.validateContactInput = (fields) => {
  if (!fields.email || fields.email === "") {
    error["email"] = "E-mail is required";
  }

  if (fields.email) {
    if (!emailEx.test(String(fields.email).toLowerCase())) {
      error["email"] = "Enter a valid email";
    }
  }
  if (!fields.phone || fields.phone === "") {
    error["phone"] = "Phone is required";
  }
  if (fields.phone) {
    if (fields.phone.length < 10) {
      error["phone"] = "Enter a valid Phone Number";
    }
  }
  if (!fields.name || fields.name === "") {
    error["name"] = "Name is required";
  }
  if (!fields.message || fields.message === "") {
    error["message"] = "Message is required";
  }

  return { errors: error, success: false };
};

module.exports.validateRequestTourInput = (fields) => {
  if (!fields.email || fields.email === "") {
    error["email"] = "E-mail is required";
  }

  if (fields.email) {
    if (!emailEx.test(String(fields.email).toLowerCase())) {
      error["email"] = "Enter a valid email";
    }
  }
  if (!fields.phone || fields.phone === "") {
    error["phone"] = "Phone is required";
  }
  if (fields.phone) {
    if (fields.phone.length < 10) {
      error["phone"] = "Enter a valid Phone Number";
    }
  }

  if (!fields.name || fields.name === "") {
    error["name"] = "Name is required";
  }

  if (!fields.date || fields.date === "") {
    error["date"] = "Date is required";
  }

  if (!fields.time || fields.time === "") {
    error["time"] = "Time is required";
  }

  if (fields.date) {
    if (!dateFormat.test(String(fields.date))) {
      error["date"] = "Enter a valid Date e.g (DD/MM/YYYY)";
    }
  }
  if (fields.time) {
    if (!timeFormat.test(String(fields.time.split(" ")[0]))) {
      error["time"] = "Enter a valid Time e.g (HH:MM PM/AM)";
    }
  }

  if (!fields.message || fields.message === "") {
    error["message"] = "Message is required";
  }

  return { errors: error, success: false };
};
