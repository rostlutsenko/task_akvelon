const url = "http://localhost:3000/arr";

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

    request.send(JSON.stringify(body));
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

    number.appendChild(document.createTextNode(element.number));
    invoiceDate.appendChild(document.createTextNode(element.date_created));
    supplyDate.appendChild(document.createTextNode(element.date_supplied));
    comment.appendChild(document.createTextNode(element.comment));

    tr.appendChild(invoiceDate);
    tr.appendChild(number);
    tr.appendChild(supplyDate);
    tr.appendChild(comment);

    tbody.appendChild(tr);
  });

  results.insertBefore(tbody, results.firstElementChild);
}

sendRequest("get", url)
  .then(function(data) {
    displayData(data);
  })
  .catch(function(err) {
    console.log(err);
  });

document.querySelector(".btn__save").addEventListener("click", function() {
  const data = {
    number: document.querySelector("[name=number]").value,
    invoice_date: document.querySelector("[name=invoice_date]").value,
    supply_date: document.querySelector("[name=supply_date]").value,
    comment: ""
  };

  sendRequest("post", url, data)
    .then(function(data) {
      console.log(data);
    })
    .catch(function(err) {
      console.log(err);
    });
});
