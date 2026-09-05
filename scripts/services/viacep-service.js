const VIACEP_BASE_URL = "https://viacep.com.br/ws";
const DEFAULT_TIMEOUT_MS = 5000;

export const VIACEP_ERROR_CODES = Object.freeze({
  INVALID_CEP: "INVALID_CEP",
  NOT_FOUND: "NOT_FOUND",
  REQUEST_FAILED: "REQUEST_FAILED",
  TIMEOUT: "TIMEOUT",
  CANCELLED: "CANCELLED",
});

export class ViaCepError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "ViaCepError";
    this.code = code;
  }
}

let activeRequestController = null;

function normalizeCep(cep) {
  return String(cep ?? "").replace(/\D/g, "");
}

function validateCep(cep) {
  if (cep.length !== 8) {
    throw new ViaCepError(
      VIACEP_ERROR_CODES.INVALID_CEP,
      "O CEP deve possuir exatamente 8 dígitos.",
    );
  }
}

function createAddress(data) {
  return {
    street: data.logradouro || "",
    neighborhood: data.bairro || "",
    city: data.localidade || "",
  };
}

export async function getAddressByCep(cep, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const normalizedCep = normalizeCep(cep);

  validateCep(normalizedCep);

  if (activeRequestController) {
    activeRequestController.abort();
  }

  const controller = new AbortController();
  activeRequestController = controller;

  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(`${VIACEP_BASE_URL}/${normalizedCep}/json/`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ViaCepError(VIACEP_ERROR_CODES.REQUEST_FAILED, "Não foi possível consultar o CEP.");
    }

    const data = await response.json();

    if (data.erro) {
      throw new ViaCepError(VIACEP_ERROR_CODES.NOT_FOUND, "CEP não encontrado.");
    }

    return createAddress(data);
  } catch (error) {
    if (error instanceof ViaCepError) {
      throw error;
    }

    if (error?.name === "AbortError") {
      if (timedOut) {
        throw new ViaCepError(
          VIACEP_ERROR_CODES.TIMEOUT,
          "A consulta do CEP excedeu o tempo limite.",
        );
      }

      throw new ViaCepError(
        VIACEP_ERROR_CODES.CANCELLED,
        "A consulta anterior do CEP foi cancelada.",
      );
    }

    throw new ViaCepError(
      VIACEP_ERROR_CODES.REQUEST_FAILED,
      "Falha de conexão ao consultar o CEP.",
    );
  } finally {
    clearTimeout(timeoutId);

    if (activeRequestController === controller) {
      activeRequestController = null;
    }
  }
}
