const url = "http://localhost:3000/arr";
let invoiceArray = [];

sendRequest("get", url)
  .then(function(data) {
    displayData(data);
    invoiceArray = data;
  })
  .catch(function(err) {
    console.log(err);
  });

function sendRequest(method, url, body = null) {
  return new Promise(function(resolve, reject) {
    const request = new XMLHttpRequest();

    request.open(method, url, true);

    request.responseType = "json";
    request.setRequestHeader("Content-Type", "application/json");

    request.addEventListener("load", function() {
      request.status >= 400
        ? reject(request.response)
        : resolve(request.response);
    });

    if (method === "delete") {
      request.send();
    } else {
      request.send(JSON.stringify(body));
    }
  });
}

function displayData(data) {
  const results = document.querySelector(".results");
  const tbody = document.createElement("tbody");

  data.forEach(function(element) {
    const tr = document.createElement("tr");
    const number = document.createElement("td");
    const invoiceDate = document.createElement("td");
    const supplyDate = document.createElement("td");
    const comment = document.createElement("td");
    const buttons = document.createElement("td");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");
    const editImg = document.createElement("img");
    const deleteImg = document.createElement("img");

    number.appendChild(document.createTextNode(element.number));
    invoiceDate.appendChild(document.createTextNode(element.date_created));
    supplyDate.appendChild(document.createTextNode(element.date_supplied));
    comment.appendChild(document.createTextNode(element.comment));

    editImg.setAttribute("src", "icons/edit.svg");
    editImg.setAttribute("alt", "icon");
    editBtn.setAttribute("data-id", element.id);
    editBtn.appendChild(document.createTextNode("Edit"));
    editBtn.appendChild(editImg);
    editBtn.classList.add("btn__edit");

    deleteImg.setAttribute("src", "icons/trash.svg");
    deleteImg.setAttribute("alt", "icon");
    deleteBtn.setAttribute("data-id", element.id);
    deleteBtn.appendChild(document.createTextNode("Delete"));
    deleteBtn.appendChild(deleteImg);
    deleteBtn.classList.add("btn__delete");

    deleteBtn.addEventListener("click", function(e) {
      deleteInvoice(e.target.getAttribute("data-id"), tbody);
    });

    editBtn.addEventListener("click", function(e) {
      const mainView = document.querySelector(".main__view");
      const createView = document.querySelector(".create__view");
      showView(mainView, createView, "Edit invoice");
      editInvoice(e.target.getAttribute("data-id"));
    });

    buttons.appendChild(editBtn);
    buttons.appendChild(deleteBtn);

    tr.setAttribute("data-id", element.id);

    tr.appendChild(invoiceDate);
    tr.appendChild(number);
    tr.appendChild(supplyDate);
    tr.appendChild(comment);
    tr.appendChild(buttons);

    tbody.appendChild(tr);
  });

  results.appendChild(tbody);
}

document.querySelector(".btn__add").addEventListener("click", function() {
  const mainView = document.querySelector(".main__view");
  const createView = document.querySelector(".create__view");

  document.querySelector("[name=number]").value = "";
  document.querySelector("[name=invoice_date]").value = "";
  document.querySelector("[name=supply_date]").value = "";
  document.querySelector("[name=comment]").value = "";

  document.querySelector(".btn__save").setAttribute("data", "create");

  showView(mainView, createView, "Create invoice");
});

function showView(previousView, nextView, headerName) {
  previousView.classList.add("d-none");
  nextView.classList.remove("d-none");
  document
    .querySelector("h2[data-name=header]")
    .appendChild(document.createTextNode(headerName));
}

document.querySelector(".btn__save").addEventListener("click", function() {
  if (document.querySelector(".btn__save").getAttribute("data") === "create") {
    createInvoice();
  } else {
    saveEditedInvoice();
  }
});

function createInvoice() {
  const number = document.querySelector("[name=number]").value;
  const invoiceDate = document.querySelector("[name=invoice_date]").value;
  const supplyDate = document.querySelector("[name=supply_date]").value;
  const comment = document.querySelector("[name=comment]").value;

  if (
    number === "" ||
    invoiceDate === "" ||
    supplyDate === "" ||
    comment === ""
  ) {
    alert("You must fill all fields");
    return;
  }

  if (number.length < 3) {
    alert("Number field should have at least 3 symbols");
    return;
  }

  const data = {
    number: number,
    date_created: invoiceDate,
    date_supplied: supplyDate,
    comment: comment
  };

  sendRequest("post", url, data).catch(function(err) {
    console.log(err);
  });
}

function deleteInvoice(invoiceId, tbody) {
  sendRequest("delete", url + "/" + invoiceId + "/")
    .then(function() {
      tbody.removeChild(tbody.querySelector("tr[data-id=" + invoiceId + "]"));
    })
    .catch(function(err) {
      console.log(err);
    });
}

function editInvoice(invoiceId) {
  const number = document.querySelector("input[name=number]");
  const invoiceDate = document.querySelector("input[name=invoice_date]");
  const supplyDate = document.querySelector("input[name=supply_date]");
  const comment = document.querySelector("textarea[name=comment]");

  document.querySelector(".btn__save").setAttribute("data", invoiceId);

  invoiceArray.forEach(function(element) {
    if (element.id === invoiceId) {
      number.value = element.number;
      invoiceDate.value = element.date_created;
      supplyDate.value = element.date_created;
      comment.value = element.comment;
    }
  });
}

function saveEditedInvoice() {
  const number = document.querySelector("input[name=number]").value;
  const invoiceDate = document.querySelector("input[name=invoice_date]").value;
  const supplyDate = document.querySelector("input[name=supply_date]").value;
  const comment = document.querySelector("textarea[name=comment]").value;
  const invoiceId = document.querySelector(".btn__save").getAttribute("data");

  const data = {
    number: number,
    date_created: invoiceDate,
    date_supplied: supplyDate,
    comment: comment
  };

  sendRequest("put", url + "/" + invoiceId, data).catch(function(err) {
    console.log(err);
  });
}
