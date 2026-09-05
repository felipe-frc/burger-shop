import { beforeEach, describe, expect, it, vi } from "vitest";

async function loadViaCepService() {
  vi.resetModules();

  return import("../scripts/services/viacep-service.js");
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("viacep-service", () => {
  it("normalizes the CEP and returns the mapped address", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          logradouro: "Avenida Afonso Pena",
          bairro: "Centro",
          localidade: "Uberlândia",
        }),
      }),
    );

    const { getAddressByCep } = await loadViaCepService();

    const result = await getAddressByCep("38400-128");

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(
      "https://viacep.com.br/ws/38400128/json/",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );

    expect(result).toEqual({
      street: "Avenida Afonso Pena",
      neighborhood: "Centro",
      city: "Uberlândia",
    });
  });

  it("rejects an invalid CEP before making the HTTP request", async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    await expect(getAddressByCep("123")).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.INVALID_CEP,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a not found error when ViaCEP reports an invalid CEP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          erro: true,
        }),
      }),
    );

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    await expect(getAddressByCep("00000000")).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.NOT_FOUND,
    });
  });

  it("returns a request error when ViaCEP responds with an HTTP failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    );

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    await expect(getAddressByCep("38400128")).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.REQUEST_FAILED,
    });
  });

  it("converts network failures into a request error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    await expect(getAddressByCep("38400128")).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.REQUEST_FAILED,
    });
  });

  it("cancels the previous request when a new CEP lookup starts", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementationOnce((_url, { signal }) => {
        return new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          logradouro: "Rua Nova",
          bairro: "Centro",
          localidade: "Uberlândia",
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    const firstRequest = getAddressByCep("38400000");
    const firstExpectation = expect(firstRequest).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.CANCELLED,
    });

    const secondRequest = getAddressByCep("38400128");

    await firstExpectation;

    await expect(secondRequest).resolves.toEqual({
      street: "Rua Nova",
      neighborhood: "Centro",
      city: "Uberlândia",
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("aborts the request when the timeout is exceeded", async () => {
    vi.useFakeTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url, { signal }) => {
        return new Promise((_resolve, reject) => {
          signal.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      }),
    );

    const { getAddressByCep, VIACEP_ERROR_CODES } = await loadViaCepService();

    const request = getAddressByCep("38400128", {
      timeoutMs: 1000,
    });

    const expectation = expect(request).rejects.toMatchObject({
      name: "ViaCepError",
      code: VIACEP_ERROR_CODES.TIMEOUT,
    });

    await vi.advanceTimersByTimeAsync(1000);
    await expectation;
  });
});
