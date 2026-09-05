import { STORE_ADDRESS } from "./config.js";
import { translate } from "./i18n.js";
import { getAddressByCep, ViaCepError, VIACEP_ERROR_CODES } from "./services/viacep-service.js";
import { getOrderType, ORDER_TYPES, setOrderType } from "./state.js";
import { elements, hideAddressWarning, showAddressWarning } from "./ui.js";
import { isValidHouseNumber } from "./utils.js";

let isFetchingCep = false;
let lastFetchedCep = "";
let cepRequestId = 0;

export function getIsFetchingCep() {
  return isFetchingCep;
}

export function isPickupOrder() {
  return getOrderType() === ORDER_TYPES.PICKUP;
}

function clearAddressFields() {
  if (elements.streetInput) elements.streetInput.value = "";
  if (elements.neighborhoodInput) elements.neighborhoodInput.value = "";
  if (elements.cityInput) elements.cityInput.value = "";
}

function clearDeliveryFields() {
  clearAddressFields();

  if (elements.houseNumberInput) {
    elements.houseNumberInput.value = "";
  }

  if (elements.complementInput) {
    elements.complementInput.value = "";
  }
}

function hideCepLoading() {
  if (elements.cepLoading) {
    elements.cepLoading.classList.add("hidden");
  }
}

function showCepLoading() {
  if (elements.cepLoading) {
    elements.cepLoading.classList.remove("hidden");
  }
}

function invalidateCepRequest() {
  cepRequestId += 1;
  isFetchingCep = false;
  hideCepLoading();
}

function handleCepError(error) {
  clearDeliveryFields();
  lastFetchedCep = "";

  if (error instanceof ViaCepError && error.code === VIACEP_ERROR_CODES.NOT_FOUND) {
    showAddressWarning(translate("address.notFound"));
    return;
  }

  if (error instanceof ViaCepError && error.code === VIACEP_ERROR_CODES.CANCELLED) {
    return;
  }

  showAddressWarning(translate("address.connectionError"));
}

export function resetAddressForm() {
  invalidateCepRequest();

  if (elements.cepInput) {
    elements.cepInput.value = "";
  }

  clearDeliveryFields();
  hideAddressWarning();

  lastFetchedCep = "";

  updateOrderTypeUI();
}

export function getAddressText() {
  if (isPickupOrder()) {
    return `${translate("address.pickupPrefix")} - ${STORE_ADDRESS}`;
  }

  const street = elements.streetInput ? elements.streetInput.value.trim() : "";

  const houseNumber = elements.houseNumberInput ? elements.houseNumberInput.value.trim() : "";

  const neighborhood = elements.neighborhoodInput ? elements.neighborhoodInput.value.trim() : "";

  const city = elements.cityInput ? elements.cityInput.value.trim() : "";

  const complement = elements.complementInput ? elements.complementInput.value.trim() : "";

  return `${street}, ${houseNumber} - ${neighborhood}, ${city}${
    complement ? ` | ${translate("address.complementPrefix")}: ${complement}` : ""
  }`;
}

export function validateAddressFields() {
  if (isPickupOrder()) {
    hideAddressWarning();
    return true;
  }

  const cep = elements.cepInput ? elements.cepInput.value.replace(/\D/g, "") : "";

  const number = elements.houseNumberInput ? elements.houseNumberInput.value.trim() : "";

  const street = elements.streetInput ? elements.streetInput.value.trim() : "";

  const neighborhood = elements.neighborhoodInput ? elements.neighborhoodInput.value.trim() : "";

  const city = elements.cityInput ? elements.cityInput.value.trim() : "";

  if (isFetchingCep) {
    showAddressWarning(translate("address.waitCep"));
    return false;
  }

  if (cep.length !== 8 || street === "" || neighborhood === "" || city === "") {
    showAddressWarning(translate("address.invalidCep"));
    return false;
  }

  if (!isValidHouseNumber(number)) {
    showAddressWarning(translate("address.invalidNumber"));
    return false;
  }

  hideAddressWarning();

  return true;
}

export function updateOrderTypeUI() {
  const orderType = getOrderType();
  const isPickup = orderType === ORDER_TYPES.PICKUP;

  if (elements.orderTypeInputs) {
    elements.orderTypeInputs.forEach((input) => {
      input.checked = input.value === orderType;
    });
  }

  if (elements.deliveryFields) {
    elements.deliveryFields.classList.toggle("hidden", isPickup);
    elements.deliveryFields.setAttribute("aria-hidden", String(isPickup));
  }

  if (elements.pickupInfo) {
    elements.pickupInfo.classList.toggle("hidden", !isPickup);
  }

  if (isPickup) {
    hideAddressWarning();
  }
}

async function fetchAddressByCep() {
  if (!elements.cepInput || isPickupOrder()) {
    return;
  }

  const cep = elements.cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    invalidateCepRequest();
    clearDeliveryFields();
    hideAddressWarning();

    lastFetchedCep = "";

    return;
  }

  if (cep === lastFetchedCep) {
    return;
  }

  const requestId = ++cepRequestId;

  isFetchingCep = true;
  lastFetchedCep = cep;

  showCepLoading();
  hideAddressWarning();

  try {
    const address = await getAddressByCep(cep);

    if (requestId !== cepRequestId || isPickupOrder()) {
      return;
    }

    const { street, neighborhood, city } = address;

    if (elements.streetInput) {
      elements.streetInput.value = street;
    }

    if (elements.neighborhoodInput) {
      elements.neighborhoodInput.value = neighborhood;
    }

    if (elements.cityInput) {
      elements.cityInput.value = city;
    }

    if (!street || !neighborhood || !city) {
      clearAddressFields();
      lastFetchedCep = "";

      showAddressWarning(translate("address.incompleteCep"));

      return;
    }

    hideAddressWarning();
  } catch (error) {
    if (requestId !== cepRequestId) {
      return;
    }

    handleCepError(error);
  } finally {
    if (requestId === cepRequestId) {
      isFetchingCep = false;
      hideCepLoading();
    }
  }
}

function handleOrderTypeChange(input) {
  setOrderType(input.value);

  if (input.value === ORDER_TYPES.PICKUP) {
    invalidateCepRequest();
  }

  updateOrderTypeUI();
}

function handleCepInput() {
  if (!elements.cepInput) {
    return;
  }

  elements.cepInput.value = elements.cepInput.value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);

  const cep = elements.cepInput.value.replace(/\D/g, "");

  if (cep.length < 8) {
    invalidateCepRequest();
    clearDeliveryFields();
    hideAddressWarning();

    lastFetchedCep = "";

    return;
  }

  fetchAddressByCep();
}

function handleHouseNumberInput() {
  if (!elements.houseNumberInput) {
    return;
  }

  elements.houseNumberInput.value = elements.houseNumberInput.value.replace(/\D/g, "");

  hideAddressWarning();
}

export function bindAddressEvents() {
  updateOrderTypeUI();

  if (elements.orderTypeInputs) {
    elements.orderTypeInputs.forEach((input) => {
      input.addEventListener("change", () => {
        handleOrderTypeChange(input);
      });
    });
  }

  if (elements.cepInput) {
    elements.cepInput.addEventListener("input", handleCepInput);
  }

  if (elements.houseNumberInput) {
    elements.houseNumberInput.addEventListener("input", handleHouseNumberInput);
  }

  if (elements.complementInput) {
    elements.complementInput.addEventListener("input", hideAddressWarning);
  }
}
