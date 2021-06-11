const re =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let error = {};
module.exports.validateShareInput = (fields) => {
  if (!fields.email || fields.email === "") {
    error["email"] = "email is required";
  }
  if (!fields.recipientEmail || fields.recipientEmail === "") {
    error["recipientEmail"] = "email is required";
  }
  if (fields.email) {
    if (!re.test(String(fields.email).toLowerCase())) {
      error["email"] = "Enter a valid email";
    }
  }
  if (fields.recipientEmail) {
    if (!re.test(String(fields.recipientEmail).toLowerCase())) {
      error["recipientEmail"] = "Enter a valid email";
    }
  }

  return { errors: error, success: false };
};

module.exports.validateContactInput = (fields) => {
  if (!fields.email || fields.email === "") {
    error["email"] = "email is required";
  }

  if (fields.email) {
    if (!re.test(String(fields.email).toLowerCase())) {
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
