import { extend } from "vee-validate";
import { NOTARY } from "@/api/NOTARY";

// https://github.com/logaretm/vee-validate/issues/69

extend("document_unique", {
  params: ["id", "folio", "year", "tome"],
  validate: async (
    _,
    record: { id?: number; folio: number; year: number; tome: string }
  ) => {
    const id = record.id;
    const folio = record.folio;
    const year = record.year;
    const tome = record.tome;

    if (!folio || !year || !tome) {
      return true;
    }

    try {
      const response = await NOTARY.get("documents/documentUnique", {
        params: {
          folio,
          year,
          tome,
          id,
        },
      });
      const isDocumentUnique = response.data;
      return isDocumentUnique;
    } catch (e) {
      return `Server error (${e.response.status}), contact your administrator.`;
    }
  },
  message:
    "Document is not unique. The combination of year, folio and tome is already in use.",
});

// folio 399, tom 112, anio 2021
