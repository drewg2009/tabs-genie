function onload() {
  setCurrentFrequencyValueInForm()
}

onload()

function setCurrentFrequencyValueInForm() {
  chrome.runtime.sendMessage({ action: 'getFrequency'}).then(response => {
    // do something with response here, not outside the function
    if(response.frequency != null) {
      document.getElementById('frequencyInput').value = convertFrequencyMsIntoSeconds(response.frequency)
    }
  })
}

function showConfigurationSuccessMessage() {
  const configurationSuccessMessage = document.querySelector("#configuration-success-message")
  configurationSuccessMessage.classList.remove("d-none");
  setTimeout(function() {
    configurationSuccessMessage.classList.add("d-none")
  }, 3000)
  
}

function sendUserConfiguration() {

  const frequency = convertFrequencySecondsIntoMs(document.getElementById("frequencyInput").value)

  chrome.runtime.sendMessage({ action: 'updateConfiguration', frequency: frequency }).then(response => {
    if(response === 'updated configuration') {
      showConfigurationSuccessMessage()
    }
  })

}

function convertFrequencyMsIntoSeconds(milliseconds) {
  return parseFloat(milliseconds) / 1000
}

function convertFrequencySecondsIntoMs(seconds) {
  return parseFloat(seconds) * 1000
}

function parseAndValidateFrequency(frequency) {
  let parseResult = parseFloat(frequency)
  if (isNaN(parseResult)) {
    setErrorMessage("The frequency is not a valid number. Valid inputs look like (1, 10, 101, .1, .5, .999)")
    return false
  }
  else if (parseResult <= 0) {
    setErrorMessage("The frequency must be > 0")
    return false
  }
  return true
}

function isValid() {
  const frequency = document.getElementById("frequencyInput").value

  let isValid = false;

  isValid = parseAndValidateFrequency(frequency)

  if (isValid) {
    setErrorMessage(null)
  }
  return isValid
}

function setErrorMessage(errorMessageHTML) {
  let errorBox = document.getElementById("error")
  errorBox.innerHTML = errorMessageHTML
}

const saveButton = document.getElementById('save')

saveButton.onclick = function () {
  if (isValid()) {
    sendUserConfiguration()
  }
}